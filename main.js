const mainVinted = require("./vinted/index.js");
const express = require("express");
const app = express();
const port = 3003;
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✨ Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
}

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/feed", async (req, res) => {

});

app.listen(port, () => {
    console.log(`✨ Listening at http://localhost:${port}`);
});

mainVinted();


