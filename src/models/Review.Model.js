const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    itemEmail: { type: String },
    itemDisplayName: { type: String },
    itemId: { type: String },
    itemName: { type: String },
    itemType: { type: String },
    itemImg: { type: String },
    itemContent: { type: String },
   
});

const ReviewsModel = mongoose.model("reviews", ReviewSchema);
module.exports = ReviewsModel;
