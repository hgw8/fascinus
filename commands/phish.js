const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
const { d1, d2, d3 } = workerData;
var height = d1
var width = d2
var type = d3
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

function gen(height, width, type) {
    consoleLog('[phish] Generating phish output')
    if (type == "em") {
        var aquarium = phish.aquarium(height, width)
    } else if (type == "sym") {
        var aquarium = phish.aquarium_sym(height, width)
    }
    var output = aquarium.join("\n")
    sendUpstream(output)
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
    height = 6
}
if (width == undefined) {
    consoleLog('[phish] Width was not specified, defaulting to 5')
    width = 10
}
gen(height, width, type)