const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
const { d1, d2 } = workerData;
var height = d1
var width = d2
var phish = require('phishies');
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
    consoleLog('[phish.errorMessage] '+error.code)
    if (code == "BAD") {
        var error = errorMsg+" SHITS_FUCKED_MAN: " + extra + " not found"
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

if (height > 100) {
    consoleLog('[phish] Height requesteed was over the maximum allowable amount, defaulting to maximum')
    height = 100
}
if (width > 100) {
    consoleLog('[phish] Width requesteed was over the maximum allowable amount, defaulting to maximum')
    width = 100
}
if (height == undefined) {
    consoleLog('[phish] Height was not specified, defaulting to 5')
    height = 5
}
if (width == undefined) {
    consoleLog('[phish] Width was not specified, defaulting to 5')
    width = 7
}
consoleLog('[phish] Generating phish output')
var aquarium = phish.aquarium(height, width)
var output = aquarium.join("\n")
sendUpstream(output)