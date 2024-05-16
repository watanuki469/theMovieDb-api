const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const RegisterModel = require('./models/Register')

const app = express()
app.use(cors());

app.use(express.json())

mongoose.connect('mongodb+srv://admin:vNyLVQug8B7quWE4@cluster0.3avkh2c.mongodb.net/theMovieDb');

app.get("/", (req, res) => {
    res.json("Welcome to Vasiliev Movie Database");
})
// app.post('/register', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const checkUser = await RegisterModel.findOne({ email });
//         if (checkUser) {
//             return res.status(400).json({ message: "Email Already Used" });
//         } else {
//             RegisterModel.findOne({ email: email })
//                 .then(user => {
//                     if (user) {
//                         res.json("Already have an account")
//                     } else {
//                         RegisterModel.create({ name: name, email: email, password: password })
//                             .then(result => res.json(result))
//                             .catch(err => res.json(err))
//                         res.status(201).json({ message: 'Người dùng đã được tạo thành công.' });
//                     }
//                 })
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tạo người dùng.' });
//     }
// })
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const checkUser = await RegisterModel.findOne({ email });

        if (checkUser) {
            return res.status(400).json({ message: "Email Already Used" });
        } else {
            const newUser = await RegisterModel.create({ name, email, password });
            return res.status(201).json(newUser);
        }
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tạo người dùng.' });
    }
});

app.listen(3001, () => {
    console.log("Server is Running")
})