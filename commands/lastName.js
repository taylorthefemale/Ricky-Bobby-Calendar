const fs = require('fs');
var google = require('../gsheet').google;
var authorize = require('../gsheet').authorize;
var spreadsheetId = require('../gsheet').spreadsheetId;

module.exports = {
    name: 'lastName',
    description: 'Grab age and/or year data from google sheets',
    execute(message) {
        let last_name = [];
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), lastName);
        });
        function lastName(auth) {
            const sheets = google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Humans!A1:D',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                last_name = rows;
                last_name.shift();
            });
        }
        message.channel.send('Well thats the million-dollar question, isn\'t it?').catch(console.error);;
        setTimeout(function () {
            var resp = "";
            for (var i = 0; i < last_name.length; i++) {
                //let first = age_year[i][0];
                let last = last_name[i][1];
                //let age = age_year[i][2];
                //let year = age_year[i][3];

                let line = last;
                resp = resp.concat(line, "\n")
            }
            message.channel.send("[Last]\n" + resp).catch(console.error);;
        }, 2000);

    },

}