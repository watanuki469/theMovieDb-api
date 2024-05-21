const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: { type: String},
    email: { type: String, unique: true },
    password: { type: String },
    favorites: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['Movie', 'TVShow'] },
        itemName:{type:String}
    }]
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
