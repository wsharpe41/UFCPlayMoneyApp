const axios = require('axios');

async function fetchHTML(url){
    try{
        // Get html
        const res = await axios.get(url);
        return res.data
    }
    catch(error){
        console.error('Error fetching html',error);
    }
}

module.exports = fetchHTML;