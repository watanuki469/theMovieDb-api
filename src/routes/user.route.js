const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/user.controller"); // Corrected path

const router = express.Router();

router.post(
  "/signup", userController.signUp
);

router.post(
  "/signin", userController.signIn
);

router.post(
  "/updatePassword", userController.updatePassword
);

module.exports = router;
