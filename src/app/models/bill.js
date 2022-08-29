const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BillSchema = new Schema({
    _id: { type: Number},
    cart: [],
    userId: { type: Number, ref: 'Users'},
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    payment: { type: String, required: true },
    status: { type: Number, default: 0 },
    note: { type: String},
}, {
    timestamps: true,
})

BillSchema.plugin(AutoIncrement, {id: '<autoincrement_bill>', inc_field: '_id'});
module.exports = mongoose.model('Bill', BillSchema);