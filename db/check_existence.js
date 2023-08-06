//const Event = require('../models/event');
//const Fight = require('../models/fight');

async function check_Event(event,Event){
    // Assume connected to db
    // Get name of event
    const name = event.eventName;
    // Query db for event with name
    const query = await Event.find({eventName: name});
    if (query.length > 0) {
        console.log("Event already exists");
        return true;
    }
    return false;
}

async function check_Fight(fight,Fight){
    const query = Fight.where({redFighterName: fight.redFighterName, blueFighterName: fight.blueFighterName});
    const foundFight = await query.findOne();
    if(foundFight){
        console.log(`${foundFight.redFighterName} vs ${foundFight.blueFighterName} already exists`);
        return true;
    }
    return false;
}

module.exports = {
    check_Event: check_Event,
    check_Fight: check_Fight
}