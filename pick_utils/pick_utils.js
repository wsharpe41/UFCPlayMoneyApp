const Pick = require('../models/Pick');
const Event = require('../models/Event');
// Check if fight has already happened
async function fightStarted(fightId){
    // Get event where fightId is in the eventFights array
    const event = await Event.findOne({eventFights: fightId});
    if (event){
        console.log("Checking if fight has started")
        const eventDate = event.eventDate;
        const currentDate = new Date();
        console.log(eventDate, currentDate);
        console.log(eventDate > currentDate)
        if (eventDate > currentDate){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

async function canUpdate(pickId){
    try{
        const pick = Pick.findById(pickId)
        if (pick===null){
            console.log("Pick not found")
            return false
        }
        const fightId = pick.fightId;
        return fightStarted(fightId);
    }
    catch(error){
        console.log("Pick not found")
        return false
    }
}

module.exports = {
    fightStarted,
    canUpdate
};