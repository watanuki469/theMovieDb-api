const mongoose = require('mongoose');

const TvSchema = new mongoose.Schema({
    backdrop_path: { type: String },
    first_air_date: { type: Date },
    genreIds: [Number],    
    id: { type: String },
    original_country: [String],
    name: { type: String },
    original_language: { type: String },
    original_name: { type: String },    
    overview: { type: String },
    popularity: { type: Number },
    poster_path: { type: String },   
    vote_average: { type: Number },
    vote_count: { type: Number } 

});

const TvModel = mongoose.model('Tv', TvSchema);

module.exports = TvModel;
