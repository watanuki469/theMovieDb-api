const mongoose = require('mongoose');
const axios = require('axios');

const ReviewsModel = require('../models/Review.Model');

const addReview = async (req, res) => {
  const { itemId, itemName, itemEmail, itemDisplayName, itemContent } = req.body;

  try {
    let review = await ReviewsModel.findOne({ itemId });
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    if (!review) {
      // If review does not exist, create a new review object
      review = new ReviewsModel({
        itemId,
        itemName,
        reviews: [
          { itemEmail, itemDisplayName, itemContent, createdTime, peopleLike: [], peopleDislike: [] }
        ],
        totalLikes: 0,
        totalDislikes: 0
      });
    } else {
      // If review exists, push the new review data into the existing itemId
      review.reviews.push({
        itemEmail,
        itemDisplayName,
        itemContent,
        createdTime,
      });

      review.totalLikes += 0;
      review.totalDislikes += 0;
    }
    await review.save();

    return res.json({ message: 'Review added successfully', review });
  } catch (error) {
    return res.json({ message: error.message });
  }
}
const getUserView = async (req, res) => {
  const { itemId, itemEmail } = req.query;

  try {
    // Find the review with the specified itemId
    const review = await ReviewsModel.findOne({ itemId });

    if (!review) {
      // If no review is found with the given itemId, return a not found message
      return res.json({ message: `No reviews found` });
    }

    // Find the specific user's review within the reviews array
    const userReview = review.reviews.find(r => r.itemEmail === itemEmail);

    if (!userReview) {
      // If no review is found by the specified user, return a not found message
      return res.status(404).json({ message: 'No review found for this user.' });
    }

    // Return the user's review
    return res.json({ userReview });
  } catch (error) {
    // Handle any errors that occurred during the database query
    return res.status(500).json({ message: error.message });
  }
}

const removeUserView = async (req, res) => {
  const { itemId,  reviewId } = req.body;

  try {
    // Find the review with the specified itemId
    const review = await ReviewsModel.findOne({ itemId });

    if (!review) {
      // If no review is found with the given itemId, return a not found message
      return res.status(404).json({ message: 'No review found with this itemId.' });
    }

    // Find the index of the user's review within the reviews array
    const userReviewIndex = review.reviews.findIndex(r => r._id.toString() === reviewId);

    if (userReviewIndex === -1) {
      // If no review is found by the specified user, return a not found message
      return res.status(404).json({ message: 'No review found with this reviewId for the specified itemId.' });
    }

    // Remove the user's review from the reviews array
    review.reviews.splice(userReviewIndex, 1);

    // Save the updated review object back to the database
    await review.save();

    return res.json({ message: 'User review removed successfully', review });
  } catch (error) {
    // Handle any errors that occurred during the database query or update
    return res.status(500).json({ message: error.message });
  }
}


const getFullUserView = async (req, res) => {
  const { itemId } = req.query;

  try {
    // Find the review with the specified itemId
    const review = await ReviewsModel.findOne({ itemId });

    if (!review) {
      // If no review is found with the given itemId, return a not found message
      return res.json({ message: `No reviews found` });
    }

    // Return the user's review
    return res.json({ review });
  } catch (error) {
    // Handle any errors that occurred during the database query
    return res.status(500).json({ message: error.message });
  }
}

const addLikeToReview = async (req, res) => {
  const { itemId, reviewId, itemEmail, itemDisplayName } = req.body;

  try {
    const review = await ReviewsModel.findOne({ itemId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const singleReview = review.reviews.id(reviewId);
    if (!singleReview) {
      return res.status(404).json({ message: 'Single review not found' });
    }

    // Check if the user has already liked the review
    const likeIndex = singleReview.peopleLike.findIndex(like => like.itemEmail === itemEmail);
    if (likeIndex !== -1) {
      // User has already liked the review, remove the like
      singleReview.peopleLike.splice(likeIndex, 1);
      review.totalLikes -= 1;
      await review.save();
      return res.json({ message: 'Like removed successfully', review });
    } else {
      // User has not liked the review, add the like
      singleReview.peopleLike.push({ itemEmail, itemDisplayName });
      review.totalLikes += 1;
      await review.save();
      return res.json({ message: 'Like added successfully', review });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
}

module.exports = {
  addReview, getUserView, getFullUserView, addLikeToReview,removeUserView
};
