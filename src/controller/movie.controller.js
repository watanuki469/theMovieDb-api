const mongoose = require('mongoose');
const axios = require('axios');

const ReviewsModel = require('../models/Review.Model');

const addReview = async (req, res) => {
  const { itemId, itemName, itemEmail, itemDisplayName, itemContent, itemLike, itemDislike } = req.body;

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
          { itemEmail, itemDisplayName, itemContent, itemLike, itemDislike, createdTime }
        ],
        totalLikes: itemLike,
        totalDislikes: itemDislike
      });
    } else {
      // If review exists, push the new review data into the existing itemId
      review.reviews.push({
        itemEmail,
        itemDisplayName,
        itemContent,
        createdTime
      });

      review.totalLikes += itemLike;
      review.totalDislikes += itemDislike;
    }
    await review.save();

    return res.json({ message: 'Review added successfully', review });
  } catch (error) {
    return res.json({ message: error.message });
  }
}
const getUserView = async (req, res) => {
  const { itemId, itemEmail } = req.params;

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
    return res.json({ message: 'User review found', userReview });
  } catch (error) {
    // Handle any errors that occurred during the database query
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addReview, getUserView
};
