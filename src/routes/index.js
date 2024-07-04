const express = require("express");
const userRoute = require("./user.route"); 
const reviewRoute = require("./review.route"); 

const router = express.Router();

router.use("/user", userRoute);
router.use("/review", reviewRoute);

module.exports = router;
