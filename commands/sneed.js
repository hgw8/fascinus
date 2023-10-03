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
    consoleLog('[sneed.errorMessage] '+error.code)
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

output = []
output.push('THE SIGN IS A SUBTLE JOKE. THE SHOP IS CALLED \"SNEED\'S FEED & SEED\", WHERE')
output.push('FEED AND SEED BOTH END IN THE SOUND "-EED", THUS RHYMING WITH THE NAME OF')
output.push('THE OWNER, SNEED. THE SIGN SAYS THAT THE SHOP WAS "FORMERLY CHUCK\'S", IMPLYING')
output.push('THAT THE TWO WORDS BEGINNING WITH "F" AND "S" WOULD HAVE ENDED WITH "-UCK",')
output.push('RHYMING WITH "CHUCK". SO, WHEN CHUCK OWNED THE SHOP, IT WOULD HAVE BEEN CALLED')
output.push('"CHUCK\'S FUCK AND SUCK".')
sendUpstream(output.join("\n"))