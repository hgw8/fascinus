const { error } = require('console');
const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
const { d1 } = workerData; //Declare all used variables here (if you only pass 1 variable to this command you only really need d1 in here, but it doesnt matter)
var amt = d1; // Declaring d1 as var1, just for consistancy with the last file but again, this may not be necessary in all cases.
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
    consoleLog('[rspam.errorMessage] '+error.code)
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

var arr = []
if (amt > 10000) {
    consoleLog('[rpsam] Request too large was made, killing worker')
    errorMessage("error", "TOOLARGE")
} else {
    if (amt === undefined) {
        consoleLog('[rspam] Amount was not defined, defaulting to 100')
        var amt = 100
    }
    for(var i=0; i < amt; i++){
        var string = generateRandomString(70);
        timer(2);
        arr.push(string)
    }
    var output = arr.join("\n")
    sendUpstream(output)
}