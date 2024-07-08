const express = require("express");
const userRoute = require("./user.route"); 
const movieRoute = require("./movie.route"); 

const router = express.Router();

router.use("/user", userRoute);
router.use("/movie", movieRoute);

module.exports = router;
