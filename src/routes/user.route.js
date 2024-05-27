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

router.post('/addFavorite', userController.addFavoriteItem);
router.get('/getFavorite', userController.getFavoriteItem);

router.post('/addFavoriteActor', userController.addFavoriteActor);
router.get('/getFavoriteActor', userController.getFavoriteActor);

router.post('/addRecentlyViewed', userController.addRecentlyViewed);
router.get('/getRecentlyViewed', userController.getRecentlyViewed);
router.post('/removeRecentlyViewed', userController.removeRecentlyViewed);


module.exports = router;
