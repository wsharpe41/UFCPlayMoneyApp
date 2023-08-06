const mongoose = require('mongoose');

const Fight = new mongoose.Schema({
    // Set up structure for every document
    redFighterName : {
        type: String,
        required: [true, 'must provide red corner fighter name'],
    },
    blueFighterName : {
        type: String,
        required: [true, 'must provide blue corner fighter name'],
    },
    redOdds : {
        type: Number,
        required: false
    },
    blueOdds : {
        type: Number,
        required: false
    },
});

module.exports = mongoose.model('Fight',Fight);