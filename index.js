require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const _ = require('lodash');

const PREFIX = 'ricky';

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { // Setup each command for client
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
});

/*
* Todo:
* - Can buy from store (subtract points from themselves)
* - People can buy emotes in exchange for points
* - Once 3 people have purchased an emote, then its available for everyone
* - Sassy responses for anyone who tries to abuse the system
* - Be able to add new cheevos names
*/
function getFieldMask(obj) {
  return _.keys(obj).join(',');
}

function columnToLetter(column) {
  let temp;
  let letter = '';
  let col = column;
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter) {
  let column = 0;
  const { length } = letter;
  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * 26 ** (length - i - 1);
  }
  return column;
}

module.exports = {
  getFieldMask,
  columnToLetter,
  letterToColumn,
};

client.on('message', msg => {
  const content = msg.content;
  const parts = content.split(' ');
  const humans = ['first', 'last', 'age', 'year'];

  if (parts[0] != PREFIX) { return; }
  if (parts.length === 1) { msg.reply("If you ain\'t first, you\'re last!"); }

  if (msg.content === 'ricky list names') {
    client.commands.get('showNames').execute(msg);
  }
  if (parts[1] === letterToColumn('a')) {
    client.command.get('ageYear').execute(msg);
  }
  /**else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
    if (parts[2] === 'first')
      client.commands.get('ageYear').execute(msg)
    else if (parts[2] === 'last')
      client.commands.get('lastName').execute(msg)
    else if (parts[2] === 'age')
      client.commands.get('personAge').execute(msg)
    else if (parts[2] === 'year')
      client.commands.get('yearBorn').execute(msg);
    }
  else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
  if (parts.indexOf('first') === 2)
    client.commands.get('ageYear').execute(msg)
  else if (parts.indexOf('first') === 3)
    client.commands.get('ageYear').execute(msg)
  else if (parts.indexOf('first') === 4)
    client.commands.get('ageYear').execute(msg)
    else if (parts.indexOf('last') === 2)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('last') === 3)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('last') === 4)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('age') === 2)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('age') === 3)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('age') === 4)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('year') === 2)
      client.commands.get('yearBorn').execute(msg)
    else if (parts.indexOf('year') === 3)
      client.commands.get('yearBorn').execute(msg)
    else if (parts.indexOf('year') === 4)
      client.commands.get('yearBorn').execute(msg)
  }
  else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
    content.forEach(function (item, index) {
      console.log(item, index)
    });
  }*/
  else if (parts[1] === 'add' && parts[2] != null 
    && parts[3] === 'to' && parts[4] != null) {
      client.commands.get('addScore').execute(msg, (parts[2]), parts[4]);
  }
  else if (parts[1] === 'subtract' && parts[2] != null 
    && parts[3] === 'to' && parts[4] != null) {
      client.commands.get('subtractScore').execute(msg, parseInt(parts[2]), parts[4]);
  }
  else if (parts[1] === 'add' && parts[2] === 'member' && parts[3] != null){
    client.commands.get('addMember').execute(msg, parts[3]);
  }
  else if (parts[1] === 'remove' && parts[2] === 'member' && parts[3] != null){
    client.commands.get('removeMember').execute(msg, parts[3]);
  }

})

client.login(process.env.BOT_TOKEN)