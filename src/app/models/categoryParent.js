const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const CategoryParentSchema = new Schema({ 
    _id: { type: Number },
    name: { type: String, required: true },
    keyword: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
})

CategoryParentSchema.plugin(AutoIncrement, {id: '<autoincrement_categoryParent>', inc_field: '_id'})
module.exports = mongoose.model('CategoryParent', CategoryParentSchema);
