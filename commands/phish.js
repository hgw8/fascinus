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

if (height > config.phish.max_height) {
    consoleLog('[phish] Height requesteed was over the maximum allowable amount, defaulting to maximum')
    height = config.phish.max_height
}
if (width > config.phish.max_width) {
    consoleLog('[phish] Width requesteed was over the maximum allowable amount, defaulting to maximum')
    width = config.phish.max_width
}
if (height == undefined) {
    consoleLog('[phish] Height was not specified, defaulting to '+config.phish.default_height)
    height = config.phish.default_height
}
if (width == undefined) {
    consoleLog('[phish] Width was not specified, defaulting to '+config.phish.default_width)
    width = config.phish.default_width
}
gen(height, width, type)