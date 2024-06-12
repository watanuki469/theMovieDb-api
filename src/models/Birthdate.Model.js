const mongoose = require('mongoose');

const BirthDatSchema = new mongoose.Schema({
    itemName: { type: String },
    itemImg: { type: String },
    itemAge: { type: String }
});

const BirthDayModel = mongoose.model("birthDate", BirthDatSchema);
module.exports = BirthDayModel;
