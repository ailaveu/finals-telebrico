const express = require("express");

const cors = require("cors")
const mongoose = require("mongoose")
const Student = require("./models/Student")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error", error)
    })

app.get("/", (req, res) => {
    res.send("Server is running!");
});

//create
app.post("/students", async(req, res) => {
    const students = await Student.create(req.body);
    res.json(students);
});

//read all
app.get("/students", async(req, res) => {
    const students = await Student.find();
    res.json(students);
});

//read2
app.get("/students/:id", async(req, res) => {
    const students = await Student.findById(req.params.id);
    res.json(students);
});

//update
app.put("/students/:id", async(req, res) => {
    const students = await Student.findByIdAndUpdate(
        req.params.id,
        req.body, { new: true }
    )
    res.json(students);
});

app.delete("/students/:id", async(req, res) => {
    const students = await Student.findByIdAndDelete(req.params.id);

    res.json(students);
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});