var irc = require("irc");
var fs = require("fs");
var request = require('request');
var art = require('ascii-art');
var crypto = require('crypto').webcrypto;
var randomext = require('./random')

var config = { //edit your shit here
    server: "irc.supernets.org",
    port: 6697,
    SSL: true,
    channels: ['#dev'],
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

const timer = ms => new Promise(res => setTimeout(res, ms))

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

async function help(chan) {
    bot.say(chan, 'Fascinus - https://git.supernets.org/hogwart7/fascinus')
    bot.say(chan, "$flood [AMOUNT] [TEXT] - Floods the channel with a specific line x amount of times")
    bot.say(chan, "$ctcpflood [TARGET] [TEXT (one word)] [AMOUNT] - Sends x amount of CTCP requests to a target.")
    bot.say(chan, "$sneed - Pastes the Sneed's Feed and Seed copypasta.")
    bot.say(chan, "$rspam [LINES] - Spams x lines of random characters")
    bot.say(chan, "$uspam [LINES] - Spams x lines of random unicode characters of varying length")
}

async function flood(text, chan, amt) {
    if (amt > 100000) {
        bot.say(chan, "no");
    } else {
        for(var i=0; i < amt; i++){
            bot.say(chan, text);
        }
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
    if (amt > 100000) {
        bot.say(chan, "no");
    } else {
        for(var i=0; i < amt; i++){
            bot.ctcp(target, "privmsg", text);
            await timer(1000);
        }    
    }
}

async function spam(chan, amt, type) {
    if (amt > 100000) {
        bot.say(chan, "no")
    } else {
        for(var i=0; i < amt; i++){
            if (type == "unicode") {
                var string = randomext.integer(9,0) + randomext.uString(120,40);
            } else if (type == "random") {
                var string = generateRandomString(70);
            }
            await timer(5);
            bot.say(chan, string);
        }    
    }
}

bot.addListener('message', function(nick, to, text, from) {
    var args = text.split(' ');
    if (args[0] === '$help') {
        help(to);
    } else if (args[0] === '$flood') {
        args.shift()
        let amt = args.shift()
        var string = args.join(" ")
        flood(string, to, amt);
    } else if (args[0] === '$sneed') {
        sneed(to);
    } else if (args[0] === '$ctcpflood') {
        ctcp(args[1], args[2], args[3]);
    } else if (args[0] === '$rspam') {
        spam(to, args[1], "random")
    } else if (args[0] === '$uspam') {
        spam(to, args[1], "unicode");
    }
});

bot.addListener('error', function(message) {
	console.log('error: ', message);
});

console.log('Starting Fascinus');
