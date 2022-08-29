const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { CategoryParent} = require('./categoryParent');



const CategoriesSchema = new Schema({

    _id: { type: Number},
    name: { type: String, required: true, unique: true},
    alias: { type: String, required: true },
    parentId: { type: Number, ref: 'CategoryParent'},
    keyword: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
})


CategoriesSchema.plugin(AutoIncrement, {id: '<autoincrement_categories>', inc_field: '_id'})
module.exports = mongoose.model('Categories', CategoriesSchema);