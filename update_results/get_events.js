// Scrape results for a given event
const Event = require('../models/Event');
const { JSDOM } = require('jsdom');
const fetchHTML = require('../scrape_events/scraping');
const { get } = require('mongoose');
const get_picks = require('./get_picks');

async function get_past_events(){
    const url = "https://www.ufc.com/events#events-list-past";
    const htmlContent = await fetchHTML(url);
    const { window } = new JSDOM(htmlContent);
    const document = window.document;
    // wait 1 second
    const headlineElements = document.querySelectorAll('div.c-card-event--result__info');
    // Check dates
    // Get one week ago
    const t = new Date().getTime() - 604800000;

    const now = new Date();
    const past_links = [];
    for (const element of headlineElements){
        // if element is found, get attribute
        const event_card = element.querySelector('div.c-card-event--result__date');
        if (!event_card){
            console.log('no event card')
            continue;
        }
        const eventDateStr = event_card.getAttribute('data-main-card');
        const [, month, day, time, timeZone] = eventDateStr.match(/(\w{3}), (\w{3}) (\d+) \/ (\d{1,2}:\d{2} [APM]{2}) ([A-Z]{3,4})/);
        const year = new Date().getFullYear(); // Assuming current year
        const eventDate = new Date(`${month} ${day}, ${year} ${time} ${timeZone}`);
        // convert to unix time
        if (now.getTime() > eventDate.getTime() && eventDate.getTime() > t){
            console.log("found event");
            past_links.push(element.querySelector('a').getAttribute('href'));
            const found_link = element.querySelector('a').getAttribute('href');
            console.log(`found link: ${found_link}`);
            //const found_event = await get_event_from_link(found_link);
            const found_results = await get_event_results(found_link);
            console.log("Found Results");
            await get_picks(found_results);
        }
    }
    //return await get_events_from_link(past_links);
}

// Currently there aren't any past fights in the database so this function is not used
async function get_events_from_link(event_links){
    const eventData = [];
    for (const link of event_links) {
        console.log(link)
        const url = `https://www.ufc.com${link}`;
        const htmlContent = await fetchHTML(url);
        const { window } = new JSDOM(htmlContent);
        const document = window.document;
        const eventDetail = document.querySelector('div.c-hero__content');
        const eventName = eventDetail.querySelector('div.c-hero__headline').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
        console.log(eventName)
        const found_event = await Event.findOne({eventName: eventName})
        if (found_event){
            eventData.push(found_event);
        }
    }
    return eventData;
}

async function get_event_from_link(link){
    const eventData = [];
    console.log(link)
    const url = `https://www.ufc.com${link}`;
    const htmlContent = await fetchHTML(url);
    const { window } = new JSDOM(htmlContent);
    const document = window.document;
    const eventDetail = document.querySelector('div.c-hero__content');
    const eventName = eventDetail.querySelector('div.c-hero__headline').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
    console.log(eventName)
    const found_event = await Event.findOne({eventName: eventName})
    if (found_event){
        eventData.push(found_event);
    }
    
    return eventData;
}


async function get_results_from_link(event_links){
    for (const link of event_links) {
        get_event_results(link);
    }
}

async function get_event_results(link) {
    const url = `https://www.ufc.com${link}`;
    const htmlContent = await fetchHTML(url);
    const { window } = new JSDOM(htmlContent);
    const document = window.document;

    const fightData = [];

    const fightRows = document.querySelectorAll('div.c-listing-fight__content');
    fightRows.forEach((fightRow) => {
        const fightDetailListItem = fightRow.querySelector('div.c-listing-fight__content-row');
        const blueCorner = fightDetailListItem.querySelector('div.c-listing-fight__corner-image--blue');
        const blueWinner = blueCorner.querySelector('div.c-listing-fight__outcome--Win');
        const redCorner = fightDetailListItem.querySelector('div.c-listing-fight__corner-image--red');
        const redWinner = redCorner.querySelector('div.c-listing-fight__outcome--Win');
        const redFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--red').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
        const blueFighterName = fightDetailListItem.querySelector('div.c-listing-fight__corner-name--blue').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
        if (blueWinner){
            fightData.push({
                redFighterName,
                blueFighterName,
                winner: blueFighterName
            });
        }
        else if (redWinner){
            fightData.push({
                redFighterName,
                blueFighterName,
                winner: redFighterName
            });
        }
        else{
            fightData.push({
                redFighterName,
                blueFighterName,
                winner: null
            });
        }
    });
    return fightData;
}

module.exports = get_past_events;