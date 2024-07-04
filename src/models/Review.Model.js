const mongoose = require('mongoose');

const SingleReviewSchema = new mongoose.Schema({
    itemEmail: { type: String },
    itemDisplayName: { type: String },
    itemContent: { type: String },
    itemRating: { type: Number },
    itemLike: { type: Number },
    itemDislike: { type: Number },
    createdTime: { type: String }
});

const ReviewSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    reviews: [SingleReviewSchema],
    totalLikes: { type: Number, default: 0 },
    createdTime: { type: String }
});

const ReviewsModel = mongoose.model('movies', ReviewSchema);

module.exports = ReviewsModel;
