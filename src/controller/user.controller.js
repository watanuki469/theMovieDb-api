// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');

const UserModel = require('../models/User.Model');

const signUp = async (req, res) => {
  try {
    const { displayName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.json({ message: "Confirm Password/Password Not Suitable" });
    }

    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      return res.json({ message: "Email Already Used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ displayName, email, password: hashedPassword });
    await newUser.save();

    return res.json(newUser);
  } catch (error) {
    return res.json({ message: error });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (!checkUser) {
      return res.json({ message: "User Not Exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordValid) {
      return res.json({ message: 'Wrong password.' });
    }

    const loginUser = {
      email: checkUser.email,
      displayName: checkUser.displayName,
      token: checkUser._id
    };

    return res.json(loginUser);
  } catch (error) {
    console.error('Error during login:', error);
    return res.json({ message: 'Something went wrong.' });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { email, password, newPassword, confirmNewPassword } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Wrong Email" });
    }

    // Check if the current password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong password.' });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Respond with success message
    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// const addFavoriteItem = async (req, res) => {
//   const { email, movieId, mediaType, movieName } = req.body;
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.json({ message: `Email ${email} Not Exist` });
//     }

//     const isFavorite = user.favorites.some(fav => fav?.itemId === movieId);
//     if (isFavorite) {
//       user.favorites = user.favorites.filter(fav => fav.itemId !== movieId);
//       await user.save();
//       return res.json({ favorites: user });
//     } else {
//       user.favorites.push({
//         itemId: movieId,
//         itemType: mediaType,
//         itemName: movieName
//       });
//       await user.save();
//       return res.json({ favorites: user });
//     }
//   } catch (error) {
//     console.error('Error handling watchlist:', error);
//     return res.status(500).json({ message: 'Something went wrong.' });
//   }
// }
const addFavoriteItem = async (req, res) => {
  const { email, movieId, mediaType, movieName,
    movieImg, movieReleaseDay,
    movieGenre, movieReview, moviePopularity,
    movieVoteAverage, movieVoteCount
  } = req.body; // Assuming req.body instead of req.query

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }

    const existingIndex = user.favorites.findIndex(fav => fav.itemId == movieId);
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    if (existingIndex !== -1) {
      // Item exists, remove it
      user.favorites.splice(existingIndex, 1);
      await user.save();
      return res.json({ favorites: user.favorites, alert: `Remove ${movieName} success` });
    } else {
      // Item does not exist, add it
      user.favorites.push({
        itemId: movieId,
        itemType: mediaType,
        itemName: movieName,
        itemImg: movieImg,
        itemReleaseDay: movieReleaseDay,
        itemGenre: movieGenre,
        itemReview: movieReview,
        itemPopularity: moviePopularity,
        itemVoteAverage: movieVoteAverage,
        itemVoteCount: movieVoteCount,
        createdTime: createdTime
      });
      await user.save();
      return res.json({ favorites: user.favorites, alert: `Added ${movieName} success` });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went meomeo.${error}` });
  }
};

const getFavoriteItem = async (req, res) => {
  try {
    const { email } = req.query;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: `User with email ${email} does not exist` });
      }

      return res.json({ favorites: user.favorites });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  }
  catch (error) {
    console.error('Error during get favorite list:', error);
    return res.json({ message: 'Something went wrong.' });
  }
}

const addFavoriteActor = async (req, res) => {
  const {
    email, movieId, movieName, movieImg, movieReleaseDay, movieReview, moviePopularity, movieKnowFor
  } = req.body; // Assuming req.body instead of req.query

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }

    const existingIndex = user.favoritesActor.findIndex(fav => fav.itemId == movieId);
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;
    if (existingIndex !== -1) {
      // Item exists, remove it
      user.favoritesActor.splice(existingIndex, 1);
      await user.save();
      return res.json({ favoritesActor: user.favoritesActor, alert: `${movieName} has been remove from watchlist` });
    } else {
      // Item does not exist, add it
      user.favoritesActor.push({
        itemId: movieId,
        itemName: movieName,
        itemImg: movieImg,
        itemReleaseDay: movieReleaseDay,
        itemReview: movieReview,
        itemPopularity: moviePopularity,
        itemKnowFor: movieKnowFor,
        createdTime: createdTime
      });
      await user.save();
      return res.json({ favoritesActor: user.favoritesActor, alert: `${movieName} has been added to watchlist` });
    }
  } catch (error) {
    console.error('Error handling watchlist:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const getFavoriteActor = async (req, res) => {
  try {
    const { email } = req.query;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: `User with email ${email} does not exist` });
      }

      return res.json({ favoritesActor: user.favoritesActor });
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


const addRecentlyViewed = async (req, res) => {
  const { email, movieId, movieName, movieImg, movieType } = req.body; // Assuming req.body instead of req.query

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }
    if (!movieId) {
      return res.json({ message: `Id Not Exist` });
    }
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    const existingIndex = user.recentlyViewed.findIndex(fav => fav.itemId == movieId);
    if (existingIndex !== -1) {
      user.recentlyViewed[existingIndex].itemName = movieName
      user.recentlyViewed[existingIndex].createdTime = createdTime;

    } else {
      user.recentlyViewed.push({
        itemId: movieId,
        itemName: movieName,
        itemImg: movieImg,
        itemType: movieType,
        createdTime: createdTime
      });
    }
    await user.save();
    return res.json({ recentlyViewed: user.recentlyViewed });
  } catch (error) {
    console.error('Error handling recently view list:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};


const getRecentlyViewed = async (req, res) => {
  try {
    const { email } = req.query;
    try {
      const user = await UserModel.findOne({ email });
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

const removeRecentlyViewed = async (req, res) => {
  const { email, movieId, movieType, removeAll } = req.body; 

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }
    if (!movieId) {
      return res.json({ message: `Id Not Exist` });
    }
    if (removeAll === 'true') {
      user.recentlyViewed = [];
      await user.save();
      return res.json({ recentlyViewed: user.recentlyViewed });
    }

    const existingIndex = user.recentlyViewed.findIndex(
      item => item.itemId == movieId && item.itemType == movieType
    );

    if (existingIndex !== -1) {
      user.recentlyViewed.splice(existingIndex, 1);
      await user.save();
      return res.json({ recentlyViewed: user.recentlyViewed });
    } else {
      return res.json({ message: `Item with id ${movieId} and type ${movieType} not found` });
    }
  } catch (error) {
    console.error('Error handling recently view list:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const addRating = async (req, res) => {
  const { email, itemId, itemType, itemRating, itemImg, itemName } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }

    const existingRatingIndex = user.rating.findIndex(
      (rating) => rating.itemId == itemId && rating.itemType == itemType
    );
    const timezoneResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");
    const createdTime = timezoneResponse.data.datetime;

    if (existingRatingIndex !== -1) {
      user.rating[existingRatingIndex].itemRating = itemRating;
    } else {
      user.rating.push({ itemId, itemType, itemRating, itemImg, itemName, createdTime });
    }

    await user.save();
    return res.json({ rating: user.rating });
  } catch (error) {
    console.error('Error handling ratings:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
const getRating = async (req, res) => {
  try {
    const { email } = req.query;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: `User with email ${email} does not exist` });
      }

      return res.json({ ratingList: user.rating });
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
const removeRating = async (req, res) => {
  const { email, movieId, movieType } = req.body; 

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: `Email ${email} Not Exist` });
    }
    if (!movieId) {
      return res.json({ message: `Id Not Exist` });
    }

    const existingIndex = user.rating.findIndex(
      item => item.itemId == movieId && item.itemType == movieType
    );

    if (existingIndex !== -1) {
      user.rating.splice(existingIndex, 1);
      await user.save();
      return res.json({ rating: user.rating });
    } else {
      return res.json({ message: `Item with id ${movieId} and type ${movieType} not found` });
    }
  } catch (error) {
    console.error('Error handling recently view list:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  signUp,
  signIn,
  updatePassword,
  addFavoriteItem,
  getFavoriteItem,
  addFavoriteActor,
  getFavoriteActor,
  addRecentlyViewed,
  getRecentlyViewed,
  removeRecentlyViewed,
  addRating,
  getRating,
  removeRating
};
