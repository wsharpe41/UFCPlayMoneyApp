const {JSDOM} = require('jsdom');
const fetchHTML = require('./scraping');
const Fight = require('../models/Fight');

//const eventLinks = require('./parse_events_list');

// For each event link in eventlinks 
// Get the html them get divs with c-listing-fight__details class
// Get c-listing-fight__odds-row class from divs
// Get two fights c-listing-fight__corner-name c-listing-fight__corner-name--red and c-listing-fight__corner-name c-listing-fight__corner-name--blue
// Once you have those two names use the https://github.com/valish/mma-api to get fighter info
// const getFightData = async()=>{
//     const fightData = [];
//     eventLinks.then((links) => {
//         links.forEach(async (link) => {
//             const url = `https://www.ufc.com${link}`;
//             const htmlContent = await fetchHTML(url);
//             const {window} = new JSDOM(htmlContent);
//             const document = window.document;
//             document.addEventListener('DOMContentLoaded', () => {
//                 const fightRows = document.querySelectorAll('div.c-listing-fight__content');
//                 fightRows.forEach((fightRow) => {
//                     const fightDetailListItem = fightRow.querySelector('div.c-listing-fight__names-row');
//                     var redFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--red').textContent;
//                     // Remove the \n and \t from the string
//                     redFighterName = redFighterName.replace(/\n/g, '');
//                     // Trim the string and remove the extra spaces
//                     redFighterName = redFighterName.trim();
//                     // Remove extra spaces between words
//                     redFighterName = redFighterName.replace(/\s\s+/g, ' ');
//                     var blueFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--blue').textContent;
//                     // process the blueFighterName the same way as redFighterName
//                     blueFighterName = blueFighterName.replace(/\n/g, '');
//                     blueFighterName = blueFighterName.trim();
//                     blueFighterName = blueFighterName.replace(/\s\s+/g, ' ');

//                     const fightOdd = fightRow.querySelector('div.c-listing-fight__odds-wrapper');
//                     const odds = fightOdd.querySelectorAll('span.c-listing-fight__odds-amount');
//                     const redOdds = parseInt(odds[0].textContent);
//                     const blueOdds = parseInt(odds[1].textContent);
//                     fightData.push({
//                         redFighterName,
//                         blueFighterName,
//                         redOdds,
//                         blueOdds
//                         });
//                     });
//                 });
//             });
//         });
// }
// getFightData();

async function getFightData(link) {
    const url = `https://www.ufc.com${link}`;
    const htmlContent = await fetchHTML(url);
    const { window } = new JSDOM(htmlContent);
    const document = window.document;

    const fightData = [];

    const fightRows = document.querySelectorAll('div.c-listing-fight__content');
    fightRows.forEach((fightRow) => {
        const fightDetailListItem = fightRow.querySelector('div.c-listing-fight__names-row');
        const redFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--red').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
        const blueFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--blue').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
        const fightOdd = fightRow.querySelector('div.c-listing-fight__odds-wrapper');
        const odds = fightOdd.querySelectorAll('span.c-listing-fight__odds-amount');
        const redOdds = parseInt(odds[0].textContent);
        const blueOdds = parseInt(odds[1].textContent);
        
        fightData.push(new Fight({
            redFighterName,
            blueFighterName,
            redOdds,
            blueOdds
            }));
        
    });
    return fightData;
}


module.exports = getFightData;