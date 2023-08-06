const Event = require('../models/Event')
const Fight = require('../models/Fight')
const Pick = require('../models/Pick')
const User = require('../models/User')
const {
    fightStarted,
    canUpdate
} = require('../pick_utils/pick_utils');
// Going to need to get the events from the database
// Going to need to get the fights from the database
// Going to need to get the picks for the user from the database
const getAllEvents = async (req,res)=>{
    try{
        const events = await Event.find({});
        // Handle other response codes at some point
        res.status(200).json({ events });
    }
    catch(error){
        // Handle other response codes at some point
        res.status(500).json({msg:error});
    }

}

const getEvent = async(req,res)=>{
    try{
        const {id:eventId} = req.params;
        const event = await Event.find({_id:eventId});
        if (!event){
            return res.status(404).json({msg:`No event with id ${eventId}`});
        }
        // Handle other response codes at some point (500)
        res.status(200).json({event});
    }
    catch(error){
        // Handle other response codes at some point (500)
        res.status(500).json({msg:error});
    }
}

const getEventFights = async(req,res)=>{
    try{
        const {id:eventId} = req.params;
        const event = await Event.findOne({_id:eventId});
        if (!event){
            return res.status(404).json({msg:`No event with id ${eventId}`});
        }
        // For each fight in event, get the fight from the database and return all fights
        const fights = [];
        // print the properties of the event
        
        for(let fight of event.eventFights){
            const fightFromDb = await Fight.find({_id:fight});
            fights.push(fightFromDb);
        }
        // Handle other response codes at some point (500)
        res.status(200).json({fights});
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}


// Need to get all users profits
const getAllProfits = async(req,res)=>{
    const users = await User.find({});
    const profits = [];
    for(let user of users){
        profits.push({name:user.name,profit:user.profit});
    }
    res.status(200).json({profits});
}

// Get all users
const getAllUsers = async(req,res)=>{
    try{
        console.log('getting all users');
        const users = await User.find({});
        console.log(users);
        res.status(200).json({users});
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

// Get single user
const getUser = async(req,res)=>{
    try{
        const {id:userId} = req.params;
        const user = await User.findOne({_id:userId});
        if (!user){
            return res.status(404).json({msg:`No user with id ${userId}`});
        }
        res.status(200).json({user});
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

// Get user profit
const getUserProfit = async(req,res)=>{
    try{
        const {id:userId} = req.params;
        const userProfit = await User.findOne({_id:userId});
        if (!userProfit){
            return res.status(404).json({msg:`No user with id ${userId}`});
        }
        const profit = userProfit.profit;
        res.status(200).json({profit});
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

// Update profit (Deprecated)
const updateProfit = async(req,res)=>{
    const {profit} = req.body;
    const {id:userId} = req.params;
    const user = await User.findOne({_id:userId});
    user.profit += profit;
    await user.save();
    res.status(200).json({user});
}

// picks CRUD
// Create Picks
const createPick = async(req,res)=>{
    const {id:userId} = req.params;
    const user = await User.findOne({_id:userId});
    if (!user){
        return res.status(404).json({msg:`No user with id ${userId}`});
    }
    const {fightId,pick} = req.body;
    console.log(fightId);
    const fight = await Fight.findOne({_id:fightId});
    if (await fightStarted(fightId) === false){
        console.log("Fight started")
        return res.status(400).json({msg:`Fight has already started`});
    }
    if (!fight){
        return res.status(404).json({msg:`No fight with id ${fightId}`});
    }
    // Check if user already has a pick for this fight
    const existingPick = await Pick.findOne({user:user,fightId:fightId});
    if (existingPick){
        return res.status(400).json({msg:`User ${user.name} already has a pick for fight ${fightId}`});
    }

    if (pick !== fight.redFighterName && pick !== fight.blueFighterName){
        return res.status(400).json({msg:`Pick must be either ${fight.redFighterName} or ${fight.blueFighterName}`});
    }

    // Create pick with userName, fightId, and pick
    const newPick = new Pick({user,fightId,pick});
    // Save pick
    await newPick.save();

    res.status(201).json({newPick});
}

// Read picks
const getUserPicks = async(req,res)=>{
    try{
        const {id:userId} = req.params;
        const user = await User.findOne({_id:userId});
        if (!user){
            return res.status(404).json({msg:`No user with id ${userId}`});
        }
        const picks = await Pick.find({user:user});
        res.status(200).json({picks});
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

// Update picks
const updatePick = async(req,res)=>{
    try{
        const {id:pickId, newPick} = req.body;
        try{
            if(await canUpdate(pickId) === false){
                return res.status(400).json({msg:`Cannot update pick after fight has started`});
            }

            const pick = await Pick.findOneAndUpdate({_id:pickId},req.body,{pick:newPick},runValidators=true);
            res.status(200).json({pick});
        }
        catch(error){
            res.status(404).json({msg:"No pick found for fight"});
        }
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

// Delete Picks
const deletePicks = async(req,res)=>{
    try{
        const {id:pickId} = req.body;
        await Pick.findByIdAndDelete({_id:pickId});
        res.status(200).json({msg:"Pick deleted"});
    
    }
    catch(error){
        res.status(500).json({msg:error});
    }
}

module.exports = {
    getAllEvents,
    getEvent,
    getEventFights,
    getAllProfits,
    getUserProfit,
    createPick,
    getUserPicks,
    updatePick,
    deletePicks,
    updateProfit,
    getUser,
    getAllUsers
}
