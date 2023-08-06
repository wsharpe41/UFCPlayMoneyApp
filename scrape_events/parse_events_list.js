const { JSDOM } = require('jsdom');
const fetchHTML = require('./scraping');

async function getEventLinks() {
    const url = 'https://www.ufc.com/events';
    
    // Assuming fetchUFCPanel is an asynchronous function
    const htmlContent = await fetchHTML(url);

    const { window } = new JSDOM(htmlContent);
    const document = window.document;

    // Get all h3 elements with class c-card-event--result__headline
    const headlineElements = document.querySelectorAll('h3.c-card-event--result__headline');
    // for each headline element, get the href attribute in the a tag
    const eventLinks = Array.from(headlineElements).map((element) => {
        return element.querySelector('a').getAttribute('href');
    });
    return eventLinks;
}

module.exports = getEventLinks();
