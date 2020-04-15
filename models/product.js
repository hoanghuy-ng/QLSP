const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    name: { type: String },
    price: { type: String },
    description: { type: String },
    image: { type: String },
});

module.exports = mongoose.model('product', product);
