const config = require('../config/config.json')
const { parentPort, workerData } = require('worker_threads');
const { d1 } = workerData;
var url = d1
var path = require('path');
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
    consoleLog('[art.errorMessage] '+error.code)
    if (code == "ENOENT") {
        var error = errorMsg+"  ENOENT"
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

async function generate(url) {
    output = []
    var ext = path.extname(url)
    if (ext === ".png") { 
        var filetype = "png"
    } else if (ext === ".jpg") {
        var filetype = "jpg"
    } else if (ext === ".webp") {
        var filetype = "webp"
    } else if (ext === ".jpeg") {
        var filetype = "jpeg"
    } else {
        consoleLog('[art] Invalid image passed')
        sendUpstream(errorMsg+" Image must be PNG, JPG, JPEG, WEBP");
    }
    consoleLog("[art] Starting banter.py process")
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python3', ["/home/node/app/lib/banter/banter.py", url, "-t", filetype]) 
    pythonProcess.stdout.on('data', (data) => {
        output.push(data.toString())
    });
    await timer(5000);
    sendUpstream(output.join('\n'))
}

generate(url)