let { google } = require('googleapis');
const path = require('path');
let privatekeyFile = "./cert.json"
let privatekey = require(privatekeyFile);
let API_KEY = 'AIzaSyA6dXQszgPWpM_4LrZnmtske6B7C5y6yr8';

process.env.HTTPS_PROXY = `http://cseszneki.peter:870717Piller7@fwsg.pillerkft.hu:8080`
google.options({
    proxy: `http://cseszneki.peter:870717Piller7@fwsg.pillerkft.hu:8080`
});
let scopes = ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar']

function getEvents() {
    const calendar = google.calendar({
        version: 'v3',
        auth: API_KEY
    });
    console.log(calendar.events)

    calendar.events.get({
        calendarId: 'primary',
        eventId: 'dgt2f8771fdiu7ejt23afg7uag'
    }).then(function (events) {
        console.log(events)
    })
        .catch(error => {
            console.error(error);
        });

    calendar.events.list({
        calendarId: 'primary'
    }).then(function (events) {
        console.log(events)
    })
        .catch(error => {
            console.error(error);
        });
}


let jwtClient = new google.auth.JWT(
    {
        scopes: ['https://www.googleapis.com/auth/calendar'],
        keyFile: path.resolve(privatekeyFile),
    }
);

jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
        getEvents()
    }
});