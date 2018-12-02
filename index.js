const { about, addResult, classification } = require('./commands-controller');
const axios = require('axios');
const haloStorage = require('./halo-storage');
require('dotenv').config()
var Botkit = require('botkit');

function pinging() {
    setInterval(function() {
        axios.get('https://office-tournaments.herokuapp.com').catch(() => {});
    }, 300000);
}
pinging();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET and PORT in environment');
    process.exit(1);
}

var config = {}
config = {
    storage: haloStorage()
};

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(webserver);

    controller.createOauthEndpoints(webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

function getMessage(command, attributes, channel) {
    switch(command) {
        case '/about':
            return about();
        case '/addresult':
            return addResult(attributes, channel);
        case '/classification':
            return classification(channel);
        default:
            return 'Command not valid.';
    }
}

controller.on('slash_command',function(bot,message) {
    getMessage(message.command.toLowerCase(), message.text.split(' '), message.channel_name)
    .then((answer) => {
        bot.replyPublic(message, answer);
    });
})
