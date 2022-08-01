const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const About_Us_FooterSchema = new Schema({
        value: { type: String, required: true },
        createdAt: { type: Date},
        updatedAt: { type: Date},
})

module.exports = mongoose.model('AboutUsFooter', About_Us_FooterSchema)
