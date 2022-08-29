const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ContactSchema = new Schema({

    _id: { type: Number},
    fullname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    status : { type: Number, default: 0}
}, {
    timestamps: true,
})

ContactSchema.plugin(AutoIncrement, {id: '<autoincrement_contact>', inc_field: '_id'});
module.exports = mongoose.model('Contact', ContactSchema);


