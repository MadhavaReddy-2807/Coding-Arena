const express = require('express')
var cors = require('cors')
const port = 4000
const bodyparser=require('body-parser')
const {MongoClient}=require('mongodb');
const app=express();
app.use(cors())
require('dotenv').config()
app.use(bodyparser.json())
console.log(process.env.MONGO)
const url=process.env.MONGO;
const client=new MongoClient(url);
const dbname="Coding-Arena";
const db=client.db(dbname);// creates a database of dbname
app.get('/',(req,res)=>{
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
        const email = req.query.email; // Get email from query params

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
app.post('/privatecontest', async (req, res) => {
    try {
        const contestCollection = db.collection('privatecontest'); // Reference to the collection
        const { name, email,organizer, contestId, problems,startTime,endTime,participants,contestDate } = req.body; // Extract contest details


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
app.post('/upcomingcontests', async (req, res) => {
    try {
        const contestCollection = db.collection('upcomingcontests');
        const contest = req.body;

        const existingContest = await contestCollection.findOne({
            name: contest.name,
            startDate: contest.startDate
        });

        if (existingContest) {
            return res.status(409).json({ message: "Contest already exists" }); // 409: Conflict
        }

        await contestCollection.insertOne(contest);
        res.status(201).json({ message: "Contest added successfully" });
    } catch (error) {
        console.error("Error adding contest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/users', async (req, res) => {
    console.log('called')
    try {
        const usersCollection = db.collection('usersdata'); // Reference to the collection
        const userData = req.body; // Extract data from the request body

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
            // Insert new user
            await usersCollection.insertOne(userData);
            return res.status(201).json({ message: "User added successfully", user: userData });
        }
    } catch (error) {
        console.error("Error updating/inserting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port)