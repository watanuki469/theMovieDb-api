// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserModel = require('../models/User.Model');
const MovieModel = require('../models/Movie.Model');
const TVShowModel = require('../models/Tv.Model');

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
    console.error('Error during user registration:', error);
    return res.json({ message: 'An error occurred during user registration.' });
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

const addFavoriteItem = async (req, res) => {
  const { email, movieId, mediaType, movieName } = req.query;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Email Not Exist" });
    }

    const isFavorite = user.favorites.some(fav => fav?.itemId === movieId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(fav => fav.itemId !== movieId);
      await user.save();
      return res.json({ favorites: user });
    } else {
      user.favorites.push({
        itemId: movieId,
        itemType: mediaType,
        itemName: movieName
      });
      await user.save();
      return res.json({ favorites: user });
    }
  } catch (error) {
    console.error('Error handling watchlist:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

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

module.exports = {
  signUp,
  signIn,
  updatePassword,
  addFavoriteItem,
  getFavoriteItem
};
