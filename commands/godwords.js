const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
const { d1 } = workerData;
var amt = d1
var randomWords = require('../lib/randomword');
const timer = ms => new Promise(res => setTimeout(res, ms))

warningMsg = ''+config.colours.brackets+'['+config.colours.warning+'WARNING'+config.colours.brackets+']'
errorMsg = ''+config.colours.brackets+'['+config.colours.error+'ERROR'+config.colours.brackets+']'

function consoleLog(log) {
    if (config.misc.logging === "true") {
        console.log(log)
    } else {
        return;
    }
}

function errorMessage(error, code, extra) {
    consoleLog('[godwords.errorMessage] '+error.code)
    if (code == "BAD") {
        var error = errorMsg+" SHITS_FUCKED_MAN: " + extra + " not found"
    } else if (code == "TOOLARGE") {
        var error = errorMsg+" Your request is too large (Maximum is 10000)"
    } else {
        var error = errorMsg+" Unknown error"
    }
    parentPort.postMessage(error);
    process.exit()
}

async function sendUpstream(content) {
    parentPort.postMessage(content);
    process.exit()
}

function gen(amt) {
    consoleLog('[godwords.gen] Generating godwords output')
    var output = [];
    var string = [];
    var text = [];
    for(var i=0; i < amt; i++){
        var word = randomWords({ exactly: 1 });
        text.push(word);
    }
    var string = text.join(" ")
    output.push(string);
    sendUpstream(output);
}

if (amt > 10000) {
    consoleLog('[godwords] Request too large was made, killing worker')
    errorMessage("error", "TOOLARGE")
} else {
    if (amt === undefined) {
        var amt = 50
    }
    gen(amt)
}