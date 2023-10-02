const { parentPort, workerData } = require('worker_threads');
const { amt } = workerData;
var randomWords = require('better-random-words');

var hashedArray = [];
var string = [];
var text = [];
for(var i=0; i < amt; i++){
    var word = randomWords({ exactly: 1 });
    text.push(word);
}
var string = text.join(" ")
hashedArray.push(string);
//console.log(string);

// send the hashedArray to the parent thread
parentPort.postMessage(hashedArray);
process.exit()