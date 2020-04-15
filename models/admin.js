const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
});

module.exports = mongoose.model('admin', admin);
