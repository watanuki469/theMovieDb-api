const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/user.controller"); // Corrected path

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .exists().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),
    body("password")
      .exists().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password minimum 8 characters"),
    body("confirmPassword")
      .exists().withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Confirm Password does not match Password");
        }
        return true;
      }),
    body("displayName")
      .exists().withMessage("Display Name is required")
      .isLength({ min: 3 }).withMessage("Display Name minimum 3 characters")
  ],
  userController.signUp
);

router.post(
  "/signin",
  [
    body("email")
      .exists().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),
    body("password")
      .exists().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password minimum 8 characters")
  ],
  userController.signIn
);

module.exports = router;
