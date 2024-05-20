// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

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

    return res.json({ message: "Login Success" });
  } catch (error) {
    console.error('Error during login:', error);
    return res.json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  signUp,
  signIn
};
