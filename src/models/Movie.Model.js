const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    backdrop_path: { type: String },
    genreIds: [Number],
    id: { type: String },
    original_language: { type: String },
    original_title: { type: String },
    overview: { type: String },
    popularity: { type: Number },
    poster_path: { type: String },
    release_date: { type: Date },
    title: { type: String },
    video: { type: String },
    vote_average: { type: Number },
    vote_count: { type: Number } 

});

const MovieModel = mongoose.model('Movie', MovieSchema);

module.exports = MovieModel;
