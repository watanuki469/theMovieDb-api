const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{
        itemId: { type: String },
        itemType: { type: String, enum: ['Movie', 'TVShow'] },
        itemName:{type:String}
    }]
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
