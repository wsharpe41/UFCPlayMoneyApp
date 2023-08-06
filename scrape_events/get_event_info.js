const { JSDOM } = require('jsdom');
const fetchHTML = require('./scraping');
const eventLinks = require('./parse_events_list');
const get_event_fights = require('./get_event_fights');

const getEventData = async () => {
    try {
        const links = await eventLinks;
        const eventData = [];

        for (const link of links) {
            const url = `https://www.ufc.com${link}`;
            const htmlContent = await fetchHTML(url);
            const { window } = new JSDOM(htmlContent);
            const document = window.document;

            const eventDetail = document.querySelector('div.c-hero__content');
            const eventName = eventDetail.querySelector('div.c-hero__headline').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
            const eventDateStr = eventDetail.querySelector('div.c-hero__headline-suffix').textContent.replace(/\n/g, '').trim().replace(/\s\s+/g, ' ');
            const [, month, day, time, timeZone] = eventDateStr.match(/(\w{3}), (\w{3}) (\d+) \/ (\d{1,2}:\d{2} [APM]{2}) ([A-Z]{3,4})/);
            const year = new Date().getFullYear(); // Assuming current year
            const eventDate = new Date(`${month} ${day}, ${year} ${time} ${timeZone}`);
            const eventFights = await get_event_fights(link);

            eventData.push({
                eventName,
                eventDate,
                eventFights
            });
        }

        return eventData;
    } catch (error) {
        throw error;
    }
};

module.exports = getEventData;
