const express = require('express');
const router = express.Router();

const{
    createPick,
    updatePick,
    getUserPicks,
    getEventFights,
    getEvent,
    getAllEvents,
    getAllProfits,
    getUserProfit,
    updateProfit,
    deletePicks,
    getUser,
    getAllUsers
} = require('../controllers/picks');

router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUser);
router.route('/leaderboard').get(getAllProfits);
router.route('/leaderboard/:id').get(getUserProfit).patch(updateProfit);
router.route('/users/:id/picks').get(getUserPicks).delete(deletePicks).patch(updatePick).post(createPick);
router.route('/:id/fights').get(getEventFights);
router.route('/:id').get(getEvent);
router.route('/').get(getAllEvents);

module.exports = router;
