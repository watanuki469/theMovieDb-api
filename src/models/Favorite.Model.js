const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'favorites.itemType' },
    itemType: { type: String, required: true, enum: ['Movie', 'TVShow'] },
    title: String,
    overview: String,
    posterPath: String,
    releaseDate: String
  });
  

const MovieModel = mongoose.model('Movie', MovieSchema);

module.exports = MovieModel;
