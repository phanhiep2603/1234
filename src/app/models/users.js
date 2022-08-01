const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    id: { type: Number, required: true },
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, maxLenght: 60, required: true },
    email: { type: String, required: true },
    gender: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    level: { type: Number, defaultValue: 2, required: true},
    status: { type: String, defaultValue: 'Offline', required: true },
    remmemberToken: { type: String, required: true },
    createdAt: { type: Date},
    updatedAt: { type: Date},

})

module.exports = mongoose.model('UserSchema', UserSchema);