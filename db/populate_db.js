const dotenv = require('dotenv').config({ path: '../.env'});
const get_event_data = require('../scrape_events/get_event_info');
const Event = require('../models/Event');
const Fight = require('../models/Fight');
const connectDB = require('./connect');
const check_Event = require('./check_existence').check_Event;
const check_Fight = require('./check_existence').check_Fight;

async function populate_db() {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('connected to db');
        const events = await get_event_data();
        console.log('Fetched events:', events.length);
        for (let event of events) {
            const new_event = new Event(event);
            new_event.eventFights = [];
            var add_fight = false;
            for (let fight of event.eventFights) {
                const new_fight = new Fight(fight);
                if (!(await check_Fight(new_fight, Fight))) {
                    await new_fight.save();
                    new_event.eventFights.push(new_fight);
                    add_fight = true;
                }
                else{
                    // If it exists, get the fight and push it to eventFights
                    const existing_fight = await Fight.findOne({redFighterName: fight.redFighterName, blueFighterName: fight.blueFighterName});
                    new_event.eventFights.push(existing_fight);                    
                }
            }
            if (add_fight){
                if ((await check_Event(new_event, Event))) {
                    // Get the event, set eventFights to new_event.eventFights
                    const existing_event = await Event.findOne({eventName: new_event.eventName});
                    existing_event.eventFights = new_event.eventFights;
                    await existing_event.save();
                }
                else{
                    await new_event.save();
                    console.log('saving event');
                }
            }
        }
        console.log('done');
    } catch (err) {
        console.log('Error Populating DB', err);
    } finally {
        process.exit();
    }
}

async function delete_old_data() {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('connected to db');
        const time = new Date();
        // Find all events that have already happened
        const events = await Event.find({eventDate: {$lt: time}});
        console.log(`Deleting ${events.length} events`)
        // For each event delete all fights and then delete the event
        for (let event of events) {
            for (let fight of event.eventFights) {
                await fight.deleteOne();
            }
            await event.deleteOne();
        }
        console.log('done');
    } catch (err) {
        console.log('Error Deleting Old Data', err);
    } finally {
        process.exit();
    }
}

populate_db();
delete_old_data();