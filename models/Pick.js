const mongoose = require('mongoose');

const Pick = new mongoose.Schema({
    // Set up structure for every document
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'must provide user id'],
    },
    fightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fight',
        required: [true, 'must provide fight id'],
    },
    // Pick must match either redFighterName or blueFighterName
    pick: {
        type: String,
        required: [true, 'must provide pick'],
    },
    won: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Pick',Pick);