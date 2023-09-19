const mongooose = require('mongoose');

const usersSchema = new mongooose.Schema({
    brand: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    founded: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
})

module.exports = mongooose.model('e-products',usersSchema)