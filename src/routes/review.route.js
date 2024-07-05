const express = require("express");
const { body } = require("express-validator");
const movieController = require("../controller/movie.controller"); 

const router = express.Router();

router.post('/addMovieReview', movieController.addReview);
router.get('/getUserReview', movieController.getUserView);
router.get('/getFullReview', movieController.getFullUserView);
router.post('/addReviewLike', movieController.addLikeToReview);


module.exports = router;
