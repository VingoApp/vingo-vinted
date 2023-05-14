const mainVinted = require("./vinted/index.js");
const express = require("express");
const passport = require('passport');
const app = express();
const port = 3003;
const cors = require("cors");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✨ Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
}

connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('./config/passport')(passport);
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "secretKey",
        },
        async (jwtPayload, done) => {
            try {
                const user = jwtPayload.user;
               done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);
app.use(passport.initialize());

const filtersRoutes = require("./routes/filters");
app.use("/filters", filtersRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/feed", async (req, res) => {

});

app.listen(port, () => {
    console.log(`✨ Listening at http://localhost:${port}`);
});

mainVinted();


