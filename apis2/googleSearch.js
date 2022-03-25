const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

module.exports = {
    route: 'googleSearch/:query',
    description: 'googleSearch?query=lebontják',
    options: {
        urlKey: 'query',
        type: 'externalApi',
        middleCallback: (query) => parseData(query),
        //callback: data => res.json(data)
    }
}

let parseData = query => {
    async function runSample(options) {
        const res = await customsearch.cse.list({
            cx: options.cx,
            q: options.q,
            auth: options.apiKey,
            sort: 'date'
        });
        return res.data.items;
    }
    return runSample({
        cx: '10a21e71a894948c3',
        apiKey: 'AIzaSyBE_ljltsE17ZwOH2rtVjPZl6p1f43pdGI',
        q: query
    })
};