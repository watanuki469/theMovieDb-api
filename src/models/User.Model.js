const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    favorites: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['movie', 'tv'] },
        itemName: { type: String },       
        itemImg:{type:String},
        itemReleaseDay:{type:Date},
        itemGenre:[Number],
        itemReview:{type:String},
        itemPopularity:{type:String},
        itemVoteAverage:{type:String},
        itemVoteCount:{type:String},   
        createdTime: { type: String }
    }],
    favoritesActor: [{
        itemId: { type: String },
        itemName: { type: String },       
        itemImg:{type:String},
        itemReleaseDay:{type:Date},
        itemReview:{type:String},
        itemPopularity:{type:String},
        itemKnowFor:{type:String},
        createdTime: { type: String }
    }],
    recentlyViewed: [{
        itemId: { type: String ,require:true},
        itemName: { type: String },       
        itemImg:{type:String},
        itemType: { type: String, enum: ['movie', 'tv','person'] },
        createdTime: { type: String }

    }],
    rating: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['movie', 'tv'] },
        itemRating: { type: Number },
        itemImg: { type: String },
        itemName: { type: String },
        createdTime: { type: String }    
    }]
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
