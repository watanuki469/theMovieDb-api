const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    favorites: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['Movie', 'TV'] },
        itemName: { type: String },       
        itemImg:{type:String},
        itemReleaseDay:{type:Date},
        itemGenre:[Number],
        itemReview:{type:String},
        itemPopularity:{type:String},
        itemVoteAverage:{type:String},
        itemVoteCount:{type:String},   
    }],
    favoritesActor: [{
        itemId: { type: String },
        itemName: { type: String },       
        itemImg:{type:String},
        itemReleaseDay:{type:Date},
        itemReview:{type:String},
        itemPopularity:{type:String},
        itemKnowFor:{type:String}
    }],
    recentlyViewed: [{
        itemId: { type: String ,require:true},
        itemName: { type: String },       
        itemImg:{type:String},
        itemType: { type: String, enum: ['Movie', 'TV','Person'] },
        createdTime: { type: String }

    }],
    rating: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['Movie', 'TV'] },
        itemRating: { type: Number }
          
    }]
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
