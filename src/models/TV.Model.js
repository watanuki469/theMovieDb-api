const mongoose = require('mongoose');

const PeopleEmotion = new mongoose.Schema({
    itemEmail: { type: String },
    itemDisplayName: { type: String },
});

const SingleReviewSchema = new mongoose.Schema({
    itemEmail: { type: String },
    itemDisplayName: { type: String },
    itemContent: { type: String },
    peopleLike: [PeopleEmotion],
    peopleDislike: [PeopleEmotion],
    createdTime: { type: String }
});

const SingleRatingSchema = new mongoose.Schema({
    itemEmail: { type: String },
    itemDisplayName: { type: String },
    itemRating: { type: Number },  
});

const ReviewSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    reviews: [SingleReviewSchema],
    ratings: [SingleRatingSchema],
    totalLikes: { type: Number, default: 0 },
    totalDislikes: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    createdTime: { type: String }
});

const TVModel = mongoose.model('tv', ReviewSchema);

module.exports = TVModel;
