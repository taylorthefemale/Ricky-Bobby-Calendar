const fs = require('fs');
var google = require('../gsheet').google;
var authorize = require('../gsheet').authorize;
var spreadsheetId = require('../gsheet').spreadsheetId;

module.exports = {
    name: 'yearBorn',
    description: 'Grab age and/or year data from google sheets',
    execute(message) {
        let year_born = [];
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), yearBorn);
        });
        function yearBorn(auth) {
            const sheets = google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Humans!A1:D',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                year_born = rows;
                year_born.shift();
            });
        }
        message.channel.send('Well thats the million-dollar question, isn\'t it?').catch(console.error);;
        setTimeout(function () {
            var resp = "";
            for (var i = 0; i < year_born.length; i++) {
                //let first = year_born[i][0];
                //let last = age_year[i][1];
                //let age = age_year[i][2];
                let year = year_born[i][3];

                let line = year;
                resp = resp.concat(line, "\n")
            }
            message.channel.send("[Year Born]\n" + resp).catch(console.error);;
        }, 2000);

    },

}