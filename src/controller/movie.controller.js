const mongoose = require('mongoose');
const axios = require('axios');


const ReviewsModel = require('../models/Review.Model');


const addReview = async (req, res) => {
  const { itemId,itemName,itemEmail, itemDisplayName, itemContent, itemRating, itemLike, itemDislike } = req.body;

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
          { itemEmail, itemDisplayName, itemContent, itemRating, itemLike, itemDislike, createdTime}
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
        itemRating,
        itemLike,
        itemDislike,
        createdTime
      });

      // Recalculate total likes and dislikes
      review.totalLikes += itemLike;
      review.totalDislikes += itemDislike;
    }

    // Save the updated review data
    await review.save();

    return res.json({ message: 'Review added successfully', review });
  } catch (error) {
    return res.json({ message: error.message });
  }
}


module.exports = {
  addReview
};
