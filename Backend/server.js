const express = require('express')
const nodemailer = require("nodemailer");

var cors = require('cors')
const port = 4000
const bodyparser = require('body-parser')
const { MongoClient } = require('mongodb');
const app = express();
app.use(cors())
require('dotenv').config()
app.use(bodyparser.json())
console.log(process.env.EMAIL_PASS)

const url = process.env.MONGO;
const client = new MongoClient(url);
const dbname = "Coding-Arena";
const db = client.db(dbname);

app.get('/', (req, res) => {
    res.send("hellowword")
})
app.post('/getusers',async(req,res)=>{
    const usersCollection = db.collection('usersdata');
    const {userIds}=req.body;
    if(userIds.length!=0)
    {
      const users = await usersCollection.find({ email: { $in: userIds } }).toArray();
      res.json(users);
    }
  
  })
app.get('/contests/:id', async (req, res) => {
    try {
        const contestId = req.params.id;
        const contestCollection = db.collection('upcomingcontests');

        const contest = await contestCollection.findOne({ id: contestId });

        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        res.status(200).json(contest);
    } catch (error) {
        console.error("Error fetching contest details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post('/privatecontests/:id/register', async (req, res) => {
    try {
        const contestId = req.params.id;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required." });
        }

        const contestCollection = db.collection('privatecontest');
        const usersCollection = db.collection('usersdata');

        // Find the contest
        const contest = await contestCollection.findOne({ contestId });

        if (!contest) {
            return res.status(404).json({ error: "Private contest not found." });
        }

        // Check if the participant is already registered
        if (contest.participants?.some(p => p.email === email)) {
            return res.status(400).json({ error: "You are already registered for this contest." });
        }

        // Fetch the user's Codeforces handle
        const user = await usersCollection.findOne({ email });
        const cfHandle = user?.cfHandle || null; // Use null if cfHandle is not found

        // Add participant to the contest
        const updatedContest = await contestCollection.updateOne(
            { contestId },
            { $push: { participants: { name, email, cfHandle } } }
        );

        if (updatedContest.modifiedCount === 0) {
            return res.status(500).json({ error: "Failed to register for the contest." });
        }

        // Update the user's contests array
        const contestData = {
            name: contest.name,
            url: `${process.env.FRONTEND_URL}/CostumContests/${contestId}`
        };

        await usersCollection.updateOne(
            { email: email },
            { $push: { contests: contestData } }
        );

        res.status(200).json({ message: "Successfully registered!", participant: { name, email, cfHandle } });

    } catch (error) {
        console.error("Error registering participant:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/upcomingcontests', async (req, res) => {
    try {
        const contestCollection = db.collection('upcomingcontests');
        const contests = await contestCollection.find().toArray();

        // Update the link to "contest/{contestId}"
        const updatedContests = contests.map(contest => ({
            ...contest,
            link: `/contests/${contest.id}` // Modify the link dynamically
        }));

        res.status(200).json(updatedContests);
    } catch (error) {
        console.error("Error fetching upcoming contests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/users', async (req, res) => {
    try {
        const usersCollection = db.collection('usersdata');
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ error: "Email query parameter is required" });
        }

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/privatecontests/:id', async (req, res) => {
    try {
        const contestId = req.params.id;
        const contestCollection = db.collection('privatecontest');

        const contest = await contestCollection.findOne({ contestId });

        if (!contest) {
            return res.status(404).json({ error: "Private contest not found" });
        }

        res.status(200).json(contest);
    } catch (error) {
        console.error("Error fetching private contest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/privatecontest', async (req, res) => {
    try {
        const contestCollection = db.collection('privatecontest');
        const { name, email, organizer, contestId, problems, startTime, endTime, participants, contestDate } = req.body;

        const newContest = {
            name,
            email,
            organizer,
            contestId,
            contestDate,
            problems,
            createdAt: new Date(),
            endTime,
            startTime,
            participants
        };

        await contestCollection.insertOne(newContest);

        res.status(201).json({ message: "Contest created successfully", contestId });
    } catch (error) {
        console.error("Error creating private contest:", error);
    }
});
app.post('/users/update', async (req, res) => {
    console.log("hello")

    try {
        const { email, cfHandle } = req.body;
        if (!email || !cfHandle) return res.status(400).json({ error: "Email and Codeforces handle are required" });

        const usersCollection = db.collection('usersdata');
        const result = await usersCollection.updateOne(
            { email },
            { $set: { cfHandle } }
        );

        result.matchedCount > 0
            ? res.status(200).json({ message: "Codeforces handle updated successfully!" })
            : res.status(404).json({ error: "User not found" });
    } catch (error) {
        console.error("Error updating Codeforces handle:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/contests/:contestid/register", async (req, res) => {
    const { contestid } = req.params;
    const { name, email } = req.body;

    try {
        const contestCollection = db.collection('upcomingcontests');
        const usersCollection = db.collection('usersdata');

        // Find the contest
        const contest = await contestCollection.findOne({ id: contestid });
        if (!contest) return res.status(404).json({ message: "Contest not found" });

        // Check if the user is already registered
        if (contest.participants && contest.participants.some((p) => p.email === email)) {
            return res.status(400).json({ message: "User already registered" });
        }

        // Fetch the user's Codeforces handle
        const user = await usersCollection.findOne({ email }, { projection: { cfHandle: 1 } });
        const cfHandle = user?.cfHandle || null;

        // Register the user in the contest
        await contestCollection.updateOne(
            { id: contestid },
            { $push: { participants: { name, email, cfHandle } } }
        );

        // Update the user's contests array
        const contestData = {
            name: contest.name,
            url: `${process.env.FRONTEND_URL}/contests/${contestid}`
        };

        await usersCollection.updateOne(
            { email: email },
            { $push: { contests: contestData } }
        );

        // Send confirmation email
        const organizerEmail = contest.authoremail;
        if (!organizerEmail) return res.status(500).json({ message: "Organizer email not found!" });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: organizerEmail,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: organizerEmail,
            to: email,
            subject: `Registration Confirmation - ${contest.name}`,
            text: `Hi ${name},\n\nYou've successfully registered for ${contest.name}!\n\n📅 Start Time: ${contest.startTime}\n🕒 End Time: ${contest.endTime}\n\n🔗 View Contest: ${process.env.FRONTEND_URL}/contests/${contestid}\n\nBest of luck!\n\nOrganizer: ${contest.organizer}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Registered successfully, user updated, and email sent!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});



app.post('/upcomingcontests', async (req, res) => {
    try {
        console.log(req.body)
        const contestCollection = db.collection('upcomingcontests');
        const usersCollection = db.collection('usersdata');

        const contest = req.body;

        await contestCollection.insertOne(contest);

        const users = await usersCollection.find({}, { projection: { email: 1, name: 1 } }).toArray();

        if (!users.length) {
            return res.status(201).json({ message: "Contest added but no users found to notify" });
        }

        console.log(contest.authoremail)
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: contest.authoremail,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: contest.authoremail,
            subject: `🚀 New Contest Alert: ${contest.name}!`,
            text: `Hey there,\n\nA new contest has been added!\n\n📌 ${contest.name}\n📅 Start: ${contest.startDate} at ${contest.startTime}\n🏆 Organized by: ${contest.author}\n\n🔗 Register now: https://your-website.com${contest.link}\n\nBest of luck!\n\n- ${contest.author}`,
        };

        for (const user of users) {
            mailOptions.to = user.email;
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ message: "Contest added and emails sent!" });
    } catch (error) {
        console.error("Error adding contest and sending emails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/users', async (req, res) => {
    console.log('called')
    try {
        const usersCollection = db.collection('usersdata');
        const userData = req.body;

        if (!userData.email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const existingUser = await usersCollection.findOne({ email: userData.email });

        if (existingUser) {
            await usersCollection.updateOne(
                { email: userData.email },
                { $set: userData }
            );
            return res.status(200).json({ message: "User updated successfully", user: userData });
        } else {
            await usersCollection.insertOne(userData);
            return res.status(201).json({ message: "User added successfully", user: userData });
        }
    } catch (error) {
        console.error("Error updating/inserting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
