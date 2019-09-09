const fs = require('fs');
const readline = require('readline');

function readFile(file, callback) {
  return new Promise((_resolve) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(file),
    });

    lineReader.on('line', (line) => {
      try {
        callback(line);
      } catch (e) {
        /* eslint-disable-next-line */
        console.error(e);
      }
    });

    lineReader.on('close', () => {
      _resolve();
    });
  });
}

function readFileAsArray(file) {
  const arr = [];
  let firstLine = true;
  return readFile(file, (line) => {
    if (line && !firstLine) {
      arr.push(parseInt(line.replace(/\s+/gi, ' '), 10));
    }
    firstLine = false;
  }).then(() => arr);
}

function readFileAsMatrix(file) {
  const arr = [];
  let firstLine = true;
  return readFile(file, (line) => {
    if (line && !firstLine) {
      arr.push(line.replace(/\s+/gi, ' ').split(' ').map((a) => parseFloat(a)));
    }
    firstLine = false;
  }).then(() => arr);
}

function readFileAsMatrixWithDefinition(file) {
  const arr = [];
  let firstLine = true;
  let definition = [];
  return readFile(file, (line) => {
    if (line && !firstLine) {
      arr.push(line.replace(/\s+/gi, ' ').split(' ').map((a) => parseInt(a, 10)));
    }
    if (firstLine) {
      definition = line.replace(/\s+/gi, ' ').split(' ').map((a) => parseInt(a, 10));
    }
    firstLine = false;
  }).then(() => [definition, arr]);
}

function readFileAsSetOfStrings(file) {
  const arr = [];
  let firstLine = true;
  return readFile(file, (line) => {
    if (line && !firstLine) {
      arr.push(line.replace(/\s*/gi, ''));
    }
    firstLine = false;
  }).then(() => arr);
}

module.exports = {
  readFile,
  readFileAsArray,
  readFileAsMatrix,
  readFileAsMatrixWithDefinition,
  readFileAsSetOfStrings,
};
