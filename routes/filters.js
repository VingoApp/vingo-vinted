const express = require("express");
const router = express.Router();
const passport = require('passport');
const isAuth = require("../middleware/isAuth");
const rateLimit = require("../middleware/rateLimit");

const getSpecificFromDb = require("../controllers/filter/getSpecificFromDb");
const insertToDb = require("../controllers/filter/insertToDb");

router.get("/combo", [passport.authenticate('jwt', { session: false }), rateLimit], async (req, res) => {
    console.log("✨ POST /filters/combo")
    const { comboList } = req.query;
    if (!comboList) return res.status(400).json({ success: false, msg: "Missing arguments" })
    const filter = await getSpecificFromDb(comboList);
    if (!filter) return res.status(400).json({ success: false, msg: "Error while fetching data from DB" })
    return res.status(200).json(filter);
})

module.exports = router;