const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const Users = new Schema({

    _id: { type: Number},
    username: { type: String, required: true, unique: true},
    fullname: { type: String, required: true },
    password: { type: String, maxLenght: 60, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    level: { type: Number, default: 2, required: true},
    status: { type: String, default: 'Offline'},
    remmemberToken: { type: String, default: 'null', required: true},
    token: { type: Array },
}, {
    timestamps: true,
})

Users.plugin(AutoIncrement);
Users.plugin(mongooseDelete, { 
                deletedAt: true,
                overrideMethods: 'all' });
module.exports = mongoose.model('Users', Users);