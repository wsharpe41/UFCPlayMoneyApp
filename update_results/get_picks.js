const Fight = require('../models/Fight');
const Pick = require('../models/Pick');
const User = require('../models/User');

async function get_picks(fights){
    for (const fight of fights){
        // For each fight,
        const blueFight = fight.blueFighterName;
        const redFight = fight.redFighterName;
        const winner = fight.winner;
        const matchingFight = await Fight.findOne({blueFighterName: blueFight, redFighterName: redFight});
        if (matchingFight){
            // Get all picks for that fight
            const picks = await Pick.find({fightId: matchingFight._id});
            if (picks.length !== 0){
                console.log("Picks found");
                // For each pick, get the user and add the pick to the user's picks
                for (const pick of picks){
                    if (pick.pick === winner){
                        pick.won = true;
                        await pick.save();
                    }
                    getReturn(winner,matchingFight,pick);
                }
            }  
        }
    }
}

async function getReturn(winner,fight,pick){
    if (pick.pick != winner){
        // Get user
        console.log("Removing 100 from user")
        const user = await User.findById(pick.user);
        user.profit -= 100;
        await user.save();
    }
    else{
        console.log("adding profit to user")
        const user = await User.findById(pick.user);
        // Check odds
        if (pick.pick === fight.blueFighterName){
            const winningOdds = fight.blueOdds;
            user.profit += winAmount(winningOdds);
        }
        else{
            const winningOdds = fight.redOdds;
            user.profit += winAmount(winningOdds);
        }
        await user.save();
    }
}

function winAmount(winningOdds){
    if (winningOdds==null){
        return 0;
    }
    if (winningOdds < 0){
        const res = 100 * (100 / Math.abs(winningOdds));
        // Format to 2 decimal places
        return Math.round((res + Number.EPSILON) * 100) / 100;
    }
    else{
        const res = 100 * (winningOdds / 100);
        return Math.round((res + Number.EPSILON) * 100) / 100;
    }
}

module.exports = get_picks;