const express = require("express");
const userRoute = require("./user.route"); 
const movieRoute = require("./movie.route"); 
const tvRoute = require("./tv.route"); 

const router = express.Router();

router.use("/user", userRoute);
router.use("/movie", movieRoute);
router.use("/tv", tvRoute);

module.exports = router;
