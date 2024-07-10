const mongoose = require('mongoose');
const axios = require('axios');

const TVModel = require('../models/TV.Model');

const addReview = async (req, res) => {
  const { itemId, itemName,itemTMDbRating,itemTMDbRatingCount,itemTMDbReleaseDay,itemTMDbRunTime, itemEmail, itemDisplayName, itemContent } = req.body;

  try {
    let review = await TVModel.findOne({ itemId });
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    if (!review) {
      // If review does not exist, create a new review object
      review = new TVModel({
        itemId,
        itemName,
        itemImg,
        itemTMDbRating,
        itemTMDbRatingCount,
        itemTMDbReleaseDay,
        itemTMDbRunTime,
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

const addRating = async (req, res) => {
  const { itemId, itemName,itemTMDbRating,itemTMDbRatingCount,itemTMDbReleaseDay,itemTMDbRunTime, itemImg, itemEmail, itemDisplayName, itemRating } = req.body;

  try {
    let rating = await TVModel.findOne({ itemId });
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    if (!rating) {
      // If rating does not exist, create a new review object
      rating = new TVModel({
        itemId,
        itemName,
        itemImg,
        itemTMDbRating,
        itemTMDbRatingCount,
        itemTMDbReleaseDay,
        itemTMDbRunTime, 
        ratings: [
          { itemEmail, itemDisplayName, itemRating, createdTime }
        ],
        ratingAverage: itemRating
      });
    } else {
      // Check if the user has already rated this item
      const userRating = rating.ratings.find(r => r.itemEmail === itemEmail);

      if (!userRating) {
        // If the user has not rated, add the new rating
        rating.ratings.push({
          itemEmail,
          itemDisplayName,
          itemRating,
          createdTime
        });
      } else {
        // If the user has already rated, update the existing rating
        userRating.itemRating = itemRating;
        userRating.createdTime = createdTime;
      }

      // Recalculate the average rating
      const totalRating = rating.ratings.reduce((sum, r) => sum + r.itemRating, 0);
      rating.ratingAverage = totalRating / rating.ratings.length;
    }

    await rating.save();
    return res.json({ message: 'Rating added/updated successfully', rating });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
const getUserRating = async (req, res) => {
  const { itemId } = req.query;

  try {
    const rating = await TVModel.findOne({ itemId });
    if (!rating) {
      return res.json({ message: 'Item not found' });
    }
  
    return res.json({ rating });

  } catch (error) {
    return res.json({ message: error.message });
  }
};

const getSingleUserRating = async (req, res) => {
  const { itemId } = req.query;

  try {
    const rating = await TVModel.findOne({ itemId });
    if (!rating) {
      return res.json({ message: 'Item not found' });
    }
    const userRating = rating.ratings.find(r => r.itemEmail === itemEmail);
    if(!userRating){
      return res.status(404).json({ message: 'No rating found for this user.' });
    }
     
    return res.json({ rating });

  } catch (error) {
    return res.json({ message: error.message });
  }
};

const getUserView = async (req, res) => {
  const { itemId, itemEmail } = req.query;

  try {
    const review = await TVModel.findOne({ itemId });

    if (!review) {
      return res.json({ message: `No reviews found` });
    }

    const userReview = review.reviews.find(r => r.itemEmail === itemEmail);

    if (!userReview) {
      return res.status(404).json({ message: 'No review found for this user.' });
    }
    return res.json({ userReview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const removeUserView = async (req, res) => {
  const { itemId, reviewId } = req.body;

  try {
    const review = await TVModel.findOne({ itemId });

    if (!review) {
      return res.status(404).json({ message: 'No review found with this itemId.' });
    }

    const userReviewIndex = review.reviews.findIndex(r => r._id.toString() === reviewId);

    if (userReviewIndex === -1) {
      return res.status(404).json({ message: 'No review found with this reviewId for the specified itemId.' });
    }

    review.reviews.splice(userReviewIndex, 1);

    await review.save();

    return res.json({ message: 'User review removed successfully', review });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


const getFullUserView = async (req, res) => {
  const { itemId } = req.query;

  try {
    // Find the review with the specified itemId
    const review = await TVModel.findOne({ itemId });

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
    const review = await TVModel.findOne({ itemId });
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

const addDislikeToReview = async (req, res) => {
  const { itemId, reviewId, itemEmail, itemDisplayName } = req.body;

  try {
    const review = await TVModel.findOne({ itemId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const singleReview = review.reviews.id(reviewId);
    if (!singleReview) {
      return res.status(404).json({ message: 'Single review not found' });
    }

    // Check if the user has already liked the review
    const likeIndex = singleReview.peopleDislike.findIndex(like => like.itemEmail === itemEmail);
    if (likeIndex !== -1) {
      // User has already disLiked the review, remove 
      singleReview.peopleDislike.splice(likeIndex, 1);
      review.totalDislikes -= 1;
      await review.save();
      return res.json({ message: 'Dislike removed successfully', review });
    } else {
      // User has already disliked the review, add 
      singleReview.peopleDislike.push({ itemEmail, itemDisplayName });
      review.totalDislikes += 1;
      await review.save();
      return res.json({ message: 'Dislike added successfully', review });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
}

module.exports = {
  addReview, getUserView, getFullUserView, addLikeToReview, addDislikeToReview, removeUserView, addRating, getUserRating
};
