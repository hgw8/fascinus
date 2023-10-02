const { parentPort, workerData } = require('worker_threads');
const { amt } = workerData;
var randomWords = require('better-random-words');

var output = [];
var string = [];
var text = [];
for(var i=0; i < amt; i++){
    var word = randomWords({ exactly: 1 });
    text.push(word);
}
var string = text.join(" ")

output.push(string);
parentPort.postMessage(output);
process.exit()