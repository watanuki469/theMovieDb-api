const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');

const UserModel = require('../models/Review.Model');


const addReview = async (req, res) => {
  const { itemEmail,itemDisplayName,itemName,itemImg,itemAge} = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }

    const existingRatingIndex = user.rating.findIndex(
      (rating) => rating.itemId == itemId && rating.itemType == itemType
    );

    if (existingRatingIndex !== -1) {
      user.rating[existingRatingIndex].itemRating = itemRating;
    } else {
      user.rating.push({ itemId, itemType, itemRating, itemImg, itemName,createdTime });
    }

    await user.save();
    return res.json({ rating: user.rating });
  } catch (error) {
    console.error('Error handling ratings:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

const getBirthdayToday = async (req, res) => {
  try {
    const { email } = req.query;
    try {
      const exist = await BirthDayModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: `User with email ${email} does not exist` });
      }

      return res.json({ recentlyViewedList: user.recentlyViewed });
    } catch (error) {
      console.error('Error fetching favorites actor:', error);
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  }
  catch (error) {
    console.error('Error during get favorite actor list:', error);
    return res.json({ message: 'Something went wrong.' });
  }
}

module.exports = {
  getBirthdayToday
};
