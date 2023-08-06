// Run this script weekly
// This script will update the results of the previous week
// Get the current week
// Get the events from the previous week
// Get the fights from the previous week
// Get the results of the fights from the previous week
// Update profits for each user based on the results of the fights
require('dotenv').config({ path: '../.env'});
const connectDB = require('../db/connect');
const get_past_events = require('./get_events');

const update = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        await get_past_events();
        console.log("Finished updating results");
    }
    catch(error){
        console.log(error);
    }
    // Wait for 5 seconds before exiting
    process.exit();
}

update();