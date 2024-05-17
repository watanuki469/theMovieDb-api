const bcrypt = require('bcrypt');
const UserModel = require('../models/User.Model'); // Corrected path

const signUp = async (req, res) => {
  try {
    const { displayName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Confirm Password/Password Not Suitable" });
    }

    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      return res.status(400).json({ message: "Email Already Used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ displayName, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'An error occurred during user registration.' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({ message: "User Not Exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong password.' });
    }

    return res.status(200).json({ message: "Login Success" });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  signUp,
  signIn
};
