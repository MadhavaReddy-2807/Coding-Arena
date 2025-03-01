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

        // Find the contest
        const contest = await contestCollection.findOne({ contestId });

        if (!contest) {
            return res.status(404).json({ error: "Private contest not found." });
        }

        // Check if the participant is already registered
        const isAlreadyRegistered = contest.participants?.some(p => p.email === email);
        if (isAlreadyRegistered) {
            return res.status(400).json({ error: "You are already registered for this contest." });
        }

        // Add participant to the contest
        const updatedContest = await contestCollection.updateOne(
            { contestId },
            { $push: { participants: { name, email } } }
        );

        if (updatedContest.modifiedCount === 0) {
            return res.status(500).json({ error: "Failed to register for the contest." });
        }

        res.status(200).json({ message: "Successfully registered!", participant: { name, email } });
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

app.post("/contests/:contestid/register", async (req, res) => {
    const { contestid } = req.params;
    const { name, email } = req.body;

    try {
        const contestCollection = db.collection('upcomingcontests');
        const contest = await contestCollection.findOne({ id: contestid });

        if (!contest) return res.status(404).json({ message: "Contest not found" });

        if (contest.participants && contest.participants.some((p) => p.email === email)) {
            return res.status(400).json({ message: "User already registered" });
        }

        await contestCollection.updateOne(
            { id: contestid },
            { $push: { participants: { name, email } } }
        );

        console.log(contest.authoremail)
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
            text: `Hi ${name},\n\nYou've successfully registered for ${contest.name}!\n\n📅 Start Time: ${contest.startTime}\n🕒 End Time: ${contest.endTime}\n\nBest of luck!\n\nOrganizer: ${contest.organizer}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Registered successfully and email sent!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/upcomingcontests', async (req, res) => {
    try {
        const contestCollection = db.collection('upcomingcontests');
        const usersCollection = db.collection('usersdata');

        const contest = req.body;

        await contestCollection.insertOne(contest);

        const users = await usersCollection.find({}, { projection: { email: 1, name: 1 } }).toArray();

        if (!users.length) {
            return res.status(201).json({ message: "Contest added but no users found to notify" });
        }

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
