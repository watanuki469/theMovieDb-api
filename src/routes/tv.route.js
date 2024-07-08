const express = require("express");
const { body } = require("express-validator");
const TVController = require("../controller/tv.controller"); 

const router = express.Router();

router.post('/addReview', TVController.addReview);
router.get('/getUserReview', TVController.getUserView);
router.get('/getFullReview', TVController.getFullUserView);
router.post('/addReviewLike', TVController.addLikeToReview);
router.post('/addReviewDislike', TVController.addDislikeToReview);
router.post('/removeUserReview', TVController.removeUserView);


module.exports = router;
