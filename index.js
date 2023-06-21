var irc = require("irc");
var fs = require("fs");
var request = require('request');
var art = require('ascii-art');
var crypto = require('crypto').webcrypto;
var randomext = require('./random-ext')

var config = { //edit your shit here
	server: "irc.supernets.org",
    //server: "irc.goat.chat",
    port: 6697,
    SSL: true,
    channels: ['#superbowl', '#dev'],
    //channels: ['#dev2'],
	botName: "fascinus",
    userName: "fascinus",
    realName: "Sneed"
};

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels,
    secure: config.SSL,
    port: config.port,
    autoRejoin: true,
    userName: config.userName,
    realName: config.realName,
    floodProtection: false,
    floodProtectionDelay: 0
});

const generateRandomString = (amt) => {
    const chars =
        "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890`!@#$%^&*()_+{}|\"\',./ᘈᷞኬᲡ᩶ᐨᅚ⸗⡳ᾟⓅᤲ⧛ሥ⸰⯠ᬨ⧻Შ⼷ᢕ᭄◁ⱉጻ៾᪅⎑ᘂᏤ⛰⃡";
    const randomArray = Array.from(
        { length: amt },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
    const randomString = randomArray.join("");
    return randomString;
}

const randomUnicode = (amt) => {
    var array = new Uint16Array(amt);
    crypto.getRandomValues(array);
    var randStr = '';
    for (var i = 0; i < array.amt; i++) {
        randStr += String.fromCharCode(array[i]);
    };
    return randStr;
}

async function help(chan) {
    bot.say(chan, 'Fascinus')
    bot.say(chan, "$flood [TEXT] [AMOUNT] - Floods the channel with a specific line x amount of times")
    bot.say(chan, "$ctcpflood [TARGET] [TEXT (one word)] [AMOUNT] - Sends x amount of CTCP requests to a target.")
    bot.say(chan, "$sneed - Pastes the Sneed's Feed and Seed copypasta.")
}

async function flood(text, chan, times) {
    for(var i=0; i < times; i++){
        bot.say(chan, text);
    }
}

async function sneed(chan) {
    bot.say(chan, 'THE SIGN IS A SUBTLE JOKE. THE SHOP IS CALLED \"SNEED\'S FEED & SEED\", WHERE')
    bot.say(chan, 'FEED AND SEED BOTH END IN THE SOUND "-EED", THUS RHYMING WITH THE NAME OF')
    bot.say(chan, 'THE OWNER, SNEED. THE SIGN SAYS THAT THE SHOP WAS "FORMERLY CHUCK\'S", IMPLYING')
    bot.say(chan, 'THAT THE TWO WORDS BEGINNING WITH "F" AND "S" WOULD HAVE ENDED WITH "-UCK",')
    bot.say(chan, 'RHYMING WITH "CHUCK". SO, WHEN CHUCK OWNED THE SHOP, IT WOULD HAVE BEEN CALLED')
    bot.say(chan, '"CHUCK\'S FUCK AND SUCK".')
}

async function ctcp(target, text, amt) {
    for(var i=0; i < amt; i++){
        bot.ctcp(target, "privmsg", text);
        await timer(1000);
    }    
}

async function rspam(chan, amt) {
    for(var i=0; i < amt; i++){
        bot.say(chan, generateRandomString(60));
    }    
}

async function uspam(chan, amt){
    for(var i=0; i < amt; i++){
        bot.say(chan, "0" + randomext.integer(9,0) + randomext.uString(60,40));
    }    
}

const timer = ms => new Promise(res => setTimeout(res, ms))

bot.addListener('message', function(nick, to, text, from) {
    var args = text.split(' ');
    if (args[0] === '$help') {
        help(to);
    } else if (args[0] === '$flood') {
        flood(args[1], to, args[2]);
    } else if (args[0] === '$sneed') {
        sneed(to);
    } else if (args[0] === '$ctcpflood') {
        ctcp(args[1], args[2], args[3]);
    } else if (args[0] === '$rspam') {
        rspam(to, args[1])
    } else if (args[0] === '$uspam') {
        uspam(to, args[1]);
    }
});

bot.addListener('error', function(message) {
	console.log('error: ', message);
});

console.log('Starting Fascinus');
