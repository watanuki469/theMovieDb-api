const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/routes'); // Corrected path
const TVModel = require('./src/models/TV.Model');



const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:5173',
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

// app.get('/tvs/:email', async (req, res) => {
//     const email = req.params.email;
//     TVModel.find({ "ratings.itemEmail": email }).then(
//         tvs => res.json(tvs)
//     ).catch(err => res.json(err));
// });


app.listen(3000, () => {
    console.log("Server is Running on port 3000");
});
