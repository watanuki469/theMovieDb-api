const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/routes'); // Corrected path

const app = express();
const corsOptions = {
    origin: 'https://themoviedb-five.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions))

app.use(express.json());

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
