const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
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
    consoleLog('[help.errorMessage] '+error.code)
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

var output = []
output.push('Fascinus - https://git.supernets.org/hgw/fascinus')
output.push("$flood [AMOUNT (max=10000)] [TEXT] - Floods the channel with a specific line x amount of times")
output.push("$ctcpflood [TARGET] [TEXT (one word)] [AMOUNT] - Sends x amount of CTCP requests to a target.")
output.push("$sneed - Pastes the Sneed's Feed and Seed copypasta.")
output.push("$rspam [LINES (def=100, max=10000)] - Spams x lines of random characters")
output.push("$uspam [LINES (def=100, max=10000)] - Spams x lines of random unicode characters of varying length")
output.push("$art [IMAGE URL (png/jpg/webp/jpeg)] - Creates IRC art using a source image.")
output.push("$godwords [AMOUNT (def=50, max=100000)] - Generate x amount of random words. Inspired by TempleOS.")
output.push("$phish [HEIGHT (opt, max=100)] [WIDTH (opt, max=100)] - Generate an aquarium")

sendUpstream(output.join('\n'))