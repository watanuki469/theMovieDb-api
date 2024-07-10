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

const TVSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    itemImg: { type: String},
    itemTMDbRating: { type: String},
    itemTMDbRatingCount: { type: String},
    itemTMDbReleaseDay: { type: String},
    itemTMDbRunTime: { type: String},
    reviews: [SingleReviewSchema],
    ratings: [SingleRatingSchema],
    totalLikes: { type: Number, default: 0 },
    totalDislikes: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    createdTime: { type: String }
});

const TVModel = mongoose.model('tv', TVSchema);

module.exports = TVModel;
