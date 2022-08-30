const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ImagesSchema = new Schema({

    _id: { type: Number},
    file: {type: String, required: true},
}, {
    timestamps: true,
})

ImagesSchema.plugin(AutoIncrement, {id: '<autoincrement_images>', inc_field: '_id'});
module.exports = mongoose.model('Images', ImagesSchema);


