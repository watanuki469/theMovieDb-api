const express = require("express");
const { body } = require("express-validator");
const movieController = require("../controller/movie.controller"); 

const router = express.Router();

router.post('/addReview', movieController.addReview);
router.get('/getUserReview', movieController.getUserView);
router.get('/getFullReview', movieController.getFullUserView);
router.post('/addReviewLike', movieController.addLikeToReview);
router.post('/addReviewDislike', movieController.addDislikeToReview);
router.post('/removeUserReview', movieController.removeUserView);
router.post('/addRating', movieController.addRating);
router.get('/getUserRating', movieController.getUserRating);
router.get('/getFullRating', movieController.getFullRating);

module.exports = router;
