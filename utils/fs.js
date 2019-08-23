const fs = require('fs');
const readline = require('readline');

function readFileAsArray(file) {
    const arr = [];
    let firstLine = true;
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(parseInt(line.replace(/\s+/gi, " "), 10))
        }
        firstLine = false;
    }).then(() => {
        console.log('read done');
        return arr;
    })
}

function readFileAsMatrix(file) {
    const arr = [];
    let firstLine = true;
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(line.replace(/\s+/gi, " ").split(" ").map(a => parseFloat(a)))
        }
        firstLine = false;
    }).then(() => {
        console.log('read done');
        return arr;
    })
}

function readFileAsMatrixWithDefinition(file) {
    const arr = [];
    let firstLine = true;
    let definition = [];
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(line.replace(/\s+/gi, " ").split(" ").map(a => parseInt(a, 10)))
        }
        if (firstLine) {
            definition = line.replace(/\s+/gi, " ").split(" ").map(a => parseInt(a, 10))
        }
        firstLine = false;
    }).then(() => {
        console.log('read done');
        return [definition, arr];
    })
}

function readFileAsSetOfStrings(file) {
    const arr = [];
    let firstLine = true;
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(line.replace(/\s*/gi, ""))
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
    readFileAsArray,
    readFileAsMatrix,
    readFileAsMatrixWithDefinition,
    readFileAsSetOfStrings
}
