const fs = require('fs');
var google = require('../gsheet').google;
var authorize = require('../gsheet').authorize;
var spreadsheetId = require('../gsheet').spreadsheetId;

module.exports = {
  name: 'showNames',
  description: 'Grab data from google sheets',
  execute(message) {
    let personNames = [];
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), showNames);
    });
    function showNames(auth) {
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Humans!A1:B',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        personNames = rows;
        personNames.shift();
      });
    }
    message.channel.send('From now on, you\'re the Magic Man and I\'m El Diablo...').catch(console.error);;
    setTimeout(function(){ 
      var resp = "";
      for (var i = 0; i < personNames.length; i++) {
        let first = personNames[i][0];
        let last = personNames[i][1];
        let age = personNames[i][2];
        let year = personNames[i][3];
        let line = first.concat(" -> ", last);
        resp = resp.concat(line, "\n")
      }
      message.channel.send("[First -> Last]\n" + resp).catch(console.error);;
    }, 2000);

  },
  
}