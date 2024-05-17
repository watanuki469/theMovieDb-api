const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes'); // Corrected path

const app = express();
// app.use(cors({
//     origin: 'http://127.0.0.1:5173', // Your frontend URL
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     // allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors())
app.use(express.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

mongoose.connect('mongodb+srv://admin:vNyLVQug8B7quWE4@cluster0.3avkh2c.mongodb.net/theMovieDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use("/api", userRoutes);

app.get("/", (req, res) => {
    res.json("Welcome to Vasiliev Movie Database");
});

app.listen(3000, () => {
    console.log("Server is Running on port 3000");
});
