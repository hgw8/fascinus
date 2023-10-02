var irc = require("irc");
var fs = require("fs");
var readline = require('readline');
var path = require('path');
var randomext = require('./lib/randomnum');
const { Worker } = require('worker_threads');
//var randomWords = require('better-random-words');

var config = { //edit your shit here
    server: "irc.supernets.org",
    port: 6697,
    SSL: true,
    channels: ['#dev', '#fascinus'],
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
    bot.say(chan, "$rspam [LINES (def=100, max=100000)] - Spams x lines of random characters")
    bot.say(chan, "$uspam [LINES (def=100, max=100000))] - Spams x lines of random unicode characters of varying length")
    bot.say(chan, "$art [IMAGE URL (png/jpg)] - Creates IRC art using a source image.")
    bot.say(chan, "$godwords [AMOUNT (def=50, max=100000)] - Generate x amount of random words. Inspired by TempleOS.")
}

async function flood(chan, arg) {
    arg.shift() //$flood
    let amt = arg.shift() //number
    var text = arg.join(" ")
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

async function uspam(chan, amt) {
    if (amt > 100000) {
        bot.say(chan, "no")
    } else {
        if (amt === undefined) {
            var amt = 100
        }
        for(var i=0; i < amt; i++){
            var string = "" + randomext.integer(9,0) + "," + randomext.integer(9,0) + randomext.uString(120,60);
            await timer(2);
            bot.say(chan, string);
        }    
    }
}

async function rspam(chan, amt) {
    if (amt > 100000) {
        bot.say(chan, "no")
    } else {
        if (amt === undefined) {
            var amt = 100
        }
        for(var i=0; i < amt; i++){
            var string = generateRandomString(70);
            await timer(2);
            bot.say(chan, string);
        }    
    }
}

async function art(chan, url) {
    var ext = path.extname(url)
    if (ext === ".png") { 
        var filetype = "png"
    } else if (ext === ".jpg") {
        var filetype = "jpg"
    } else if (ext === ".webp") {
        var filetype = "webp"
    } else {
        bot.say(chan, "Image must be PNG or JPG");
        return
    }
    console.log("Starting Banter")
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python3', ["lib/banter/banter.py", url, "-t", filetype]) 
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString())
    });
    await timer(5000);
    fs.stat('output.txt', function(err, stat) {
        if (err == null) {
            console.log('File exists');
            const rl = readline.createInterface({
                input: fs.createReadStream('output.txt'),
                crlfDelay: Infinity,
            });
            rl.on('line', (line) => {
                bot.say(chan, line);
            });   
        } else if (err.code === 'ENOENT') {
            console.log(err);
            bot.say(chan, "Error")
        } else {
            bot.say(chan, "Other Error")
        }
    });
}

async function godwords(chan, amt) {
    if (amt > 100000) {
        bot.say(chan, "no")
    } else {
        if (amt === undefined) {
            var amt = 50
        }
        const worker = new Worker('./commands/godwords.js', { 
            workerData: {
                amt
            }
        });
        worker.once('message', (string) => {
            console.log('Received string from worker, posting.');
            bot.say(chan, string);
        });
    }
}

bot.addListener('message', function(nick, to, text, from) {
    var args = text.split(' ');
    if (args[0] === '$help') {
        help(to);
    } else if (args[0] === '$flood') {
        flood(to, args)
    } else if (args[0] === '$sneed') {
        sneed(to);
    } else if (args[0] === '$ctcpflood') {
        ctcp(args[1], args[2], args[3]);
    } else if (args[0] === '$rspam') {
        rspam(to, args[1])
    } else if (args[0] === '$uspam') {
        uspam(to, args[1]);
    } else if (args[0] === '$art') {
        art(to, args[1]);
    } else if (args[0] === '$godwords') {
        godwords(to, args[1]);
    }
});

bot.addListener('error', function(message) {
	console.log('error: ', message);
});

console.log('Starting Fascinus');