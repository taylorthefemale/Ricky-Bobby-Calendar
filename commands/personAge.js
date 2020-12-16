const fs = require('fs');
var google = require('../gsheet').google;
var authorize = require('../gsheet').authorize;
var spreadsheetId = require('../gsheet').spreadsheetId;

module.exports = {
    name: 'personAge',
    description: 'Grab age and/or year data from google sheets',
    execute(message) {
        let person_age = [];
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), personAge);
        });
        function personAge(auth) {
            const sheets = google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Humans!A1:D',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                person_age = rows;
                person_age.shift();
            });
        }
        message.channel.send('Well thats the million-dollar question, isn\'t it?').catch(console.error);;
        setTimeout(function () {
            var resp = "";
            for (var i = 0; i < person_age.length; i++) {
                //let first = person_age[i][0];
                //let last = age_year[i][1];
                let age = person_age[i][2];
                //let year = age_year[i][3];

                let line = age;
                resp = resp.concat(line, "\n")
            }
            message.channel.send("[Age]\n" + resp).catch(console.error);;
        }, 2000);

    },

}