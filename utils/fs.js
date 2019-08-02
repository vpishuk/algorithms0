const fs = require('fs');
const readline = require('readline');

function readGraphAsAdjancyList(file) {
    const arr = [];
    let firstLine = true;
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(line.replace(/\s+/gi, " ").split(" "))
        }
        firstLine = false;
    }).then(() => {
        console.log('read done');
        return arr;
    })
}

function readFile(file, callback) {
    return new Promise((_resolve) => {
        const lineReader = readline.createInterface({
            input: fs.createReadStream(file)
        });

        lineReader.on('line', (line) => {
            try {
                callback(line)
            } catch(e) {
                console.error(e)
            }
        });

        lineReader.on('close', () => {
            console.log('read complete')
            _resolve();
        });
    });
}

module.exports = {
    readFile,
    readGraphAsAdjancyList
}