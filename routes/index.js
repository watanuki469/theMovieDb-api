const express = require("express");
const userRoute = require("./user.route"); // Corrected path

const router = express.Router();

router.use("/user", userRoute);

module.exports = router;
