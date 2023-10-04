var config = require('./config/config.json')
var irc = require("irc");
const { Worker } = require('worker_threads');

warningMsg = ''+config.colours.brackets+'['+config.colours.warning+'WARNING'+config.colours.brackets+']'
errorMsg = ''+config.colours.brackets+'['+config.colours.error+'ERROR'+config.colours.brackets+']'
const msgTimeout = new Set();
const msgTimeoutMsg = new Set();
const timer = ms => new Promise(res => setTimeout(res, ms))
var hostmask = null

var bot = new irc.Client(config.irc.server, config.irc.nickname, {
    channels: config.irc.channels,
    secure: config.irc.ssl,
    port: config.irc.port,
    autoRejoin: config.irc.autorejoin,
    userName: config.irc.username,
    realName: config.irc.realname,
    floodProtection: config.floodprotect.flood_protection,
    floodProtectionDelay: config.floodprotect.flood_protection_delay
});

function consoleLog(log) {
    if (config.misc.logging === "true") {
        console.log(log)
    } else {
        return;
    }
}

function openPostWorker(chan, command, d1, d2, d3, d4, d5, d6) {
    consoleLog(`[bot.openPostWorker] Opening ${command} worker`)
    const worker = new Worker(`./commands/${command}.js`, { 
        workerData: {
        d1, d2, d3, d4, d5, d6 //d1-d6 equate to variables you can pass in to a worker, see  the example1 block below for an example (var1 there is d1 here). Further defined in individual command files.
        }
    });
    worker.once('message', (string) => {
        consoleLog(`[bot.openPostWorker.finalising] Got output from ${command}, sending to `+chan);
        bot.say(chan, string);
    });
}

async function ctcp(target, text, amt) { //This can not be moved to its own file due to the nature of how it works
    if (amt > 10000) {
        bot.say(chan, "no");
    } else {
        for(var i=0; i < amt; i++){
            bot.ctcp(target, "privmsg", text);
            await timer(1000);
        }    
    }
}

async function help(chan) {
    openPostWorker(chan, 'help')
}

async function flood(chan, arg) {
    openPostWorker(chan, 'flood', arg)
}

async function sneed(chan) {
    openPostWorker(chan, 'sneed')
}

async function uspam(chan, amt) {
    openPostWorker(chan, 'uspam', amt)
}

async function rspam(chan, amt) {
    openPostWorker(chan, 'rspam', amt)
}

async function art(chan, url) {
    openPostWorker(chan, 'art', url)
}

async function godwords(chan, amt) {
    openPostWorker(chan, 'godwords', amt)
}

async function phish(chan, height, width) {
    openPostWorker(chan, 'phish', height, width, "em")
}

async function symphish(chan, height, width) {
    openPostWorker(chan, 'phish', height, width, "sym")
}

bot.addListener('message', function(nick, to, text, from) {
    if (text.startsWith(config.irc.prefix)) {
        if (msgTimeout.has(to)) {
            if (msgTimeoutMsg.has("yes")) {
                return;
            } else {
                bot.say(to, errorMsg+" You are sending commands too quickly")
                msgTimeoutMsg.add("yes");
                setTimeout(() => {
                    msgTimeoutMsg.delete("yes");
                }, config.floodprotect.command_listen_timeout)           
            }
        } else {
            var args = text.split(' ');
            var command = args[0].toLowerCase()
            if (args[0] === '$help') {
                help(to);
            } else if (command === config.irc.prefix+'flood') {
                flood(to, args)
            } else if (command === config.irc.prefix+'sneed') {
                sneed(to);
            } else if (command === config.irc.prefix+'ctcpflood') {
                ctcp(args[1], args[2], args[3]);
            } else if (command === config.irc.prefix+'rspam') {
                rspam(to, args[1])
            } else if (command === config.irc.prefix+'uspam') {
                uspam(to, args[1]);
            } else if (command === config.irc.prefix+'art') {
                art(to, args[1]);
            } else if (command === config.irc.prefix+'godwords') {
                godwords(to, args[1]);
            } else if (command === config.irc.prefix+'phish') {
                phish(to, args[1], args[2])
            } else if (command === config.irc.prefix+'symphish') {
                symphish(to, args[1], args[2])
            }
            msgTimeout.add(to);
            setTimeout(() => {
                msgTimeout.delete(to);
            }, config.floodprotect.command_listen_timeout)
        }
    }
})


bot.addListener('error', function(message) {
    consoleLog('[ERROR]' +message) //Dump errors to console
});

process.on('uncaughtException', function (err) {
    console.error(err);
    if (config.errorhandling.log_errors_to_irc == 'true') { //If logging errors to IRC is enabled then we send the error to that, otherwise we only consoleLog it
        bot.say(config.errorhandling.error_channel, errorMsg+" "+err.stack.split('\n',1).join(" "))
    }
}); 

consoleLog('Starting Fascinus');