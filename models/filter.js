const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
    comboId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: false,
    },
    sellerName: {
        type: String,
        required: true,
    },
    sellerPp: {
        type: String,
        required: false,
    },
    sellerId: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    service_fee: {
        type: String,
        required: false,
    },
    expireDate: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('Filter', filterSchema);