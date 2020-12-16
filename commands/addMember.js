const fs = require('fs');
var google = require('../gsheet').google;
var authorizeMemberChange = require('../gsheet').authorizeMemberChange;
var spreadsheetId = require('../gsheet').spreadsheetId;

module.exports = {
  name: 'addMember',
  description: 'Add a new member from Discord',
  execute(message, name) {
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorizeMemberChange(JSON.parse(content), addMember, name);
    });
    
    function addMember(auth, name) {
      const sheets = google.sheets({version: 'v4', auth});
      var resource;
      let loc = 2;
    
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Humans!A2:B',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        let nameList = res.data.values;
        for (var i = 0; i < nameList.length; i++) {
          console.log("Just checking names: ", nameList[i][0]);
          if (nameList[i][0] == "" || !nameList[i][0]) {
            break;
          }
          loc++;
        }
        let value = name;
        let values = [[value]]
        resource = {values};
    
        setTimeout(function(){
          var rangeWrite = 'Humans!A' + loc.toString();
          console.log("this is range: ", rangeWrite);
          sheets.spreadsheets.values.update({
            spreadsheetId,
            range: rangeWrite,
            valueInputOption: 'USER_ENTERED',
            resource,
          }, (err) => {
            if (err) return console.log('The API returned an error when getting: ' + err);
          });
        }, 1000);
    
        setTimeout(function(){
          var rangeWrite = 'Humans!B' + loc.toString();
          console.log("this is range: ", rangeWrite);
          sheets.spreadsheets.values.update({
            spreadsheetId,
            range: rangeWrite,
            valueInputOption: 'USER_ENTERED',
            resource: {values: [["0"]]},
          }, (err) => {
            if (err) return console.log('The API returned an error when getting: ' + err);
          });
        }, 1000);
      });
    }

  },
  
}