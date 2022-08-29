const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SizesSchema = new Schema({

    _id: { type: Number},
    size: [],
}, {
    timestamps: true,
})

SizesSchema.plugin(AutoIncrement, {id: '<autoincrement_size>', inc_field: '_id'});
module.exports = mongoose.model('Sizes', SizesSchema);


