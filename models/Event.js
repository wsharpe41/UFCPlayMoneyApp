// I am going to just make fights a list in the event model
const mongoose = require('mongoose');


const Event = new mongoose.Schema({
    // Set up structure for every document
    eventName: {
      type:String,
      required:[true,'must provide name'],
      trim:true,
    },
    eventDate: {
        type:Date,
        required:[true,'must provide date'],
    },
    eventFights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fight'
    }]
});

module.exports = mongoose.model('Event',Event);