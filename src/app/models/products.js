const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Products = new Schema({

    _id: { type: Number},
    nameProduct: { type: String, required: true},
    category: { type: Number, ref: 'Categories'},
    priceProduct: { type: Number, default: 0},
    price_newProduct: { type: Number, required: true},
    statusProduct: { type: String, default: 1,required: true},
    introProduct: { type: String, required: true},
    contentProduct: { type: String, required: true},
    imageProduct: { type: Number, ref: 'Images'},
    sizeProduct: { type: Number, ref: 'Sizes'},
    keywordsProduct: { type: String, required: true},
    descriptionProduct: { type: String, required: true},
}, {
    timestamps: true,
})

Products.plugin(AutoIncrement, {id: '<autoincrement_product>', inc_field: '_id'});
Products.plugin(mongooseDelete, { 
                            deletedAt: true,
                            overrideMethods: 'all' });
module.exports = mongoose.model('Products', Products);


