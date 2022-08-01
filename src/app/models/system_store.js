const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemStore = new Schema({
    place: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date},
    updatedAt: { type: Date},
})

module.exports = mongoose.model('SystemStore', SystemStore);