
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');

function countAndSort(arr) {
    if (arr.length <= 1) {
        return [0, arr];
    }
    if (arr.length === 2) {
        return  [
            arr[0] > arr[1] ? 1 : 0, 
            [
                arr[0] > arr[1] ? arr[1] : arr[0],
                arr[0] > arr[1] ? arr[0] : arr[1]
            ]
        ];
    }
    const lenght = arr.length;
    const lenOfSubarray = Math.ceil(arr.length / 2);
    const [x, left] = countAndSort(arr.slice(0, lenOfSubarray));
    const [y, right] = countAndSort(arr.slice(lenOfSubarray));
    let z = 0;
    for (let i=0, j=0, k=0; k < lenght; k++) {
        if (!right[j] || left[i] < right[j]) {
            arr[k] = left[i];
            i++;
        } else if (!left[i] || left[i] > right[j]) {
            arr[k] = right[j];
            j++;
            z += left.length - i; 
        }
    }
    return [z + x + y, arr];
}

function processFile(inputFile) {
    const instream = fs.createReadStream(inputFile);
    const outstream = new stream();
    const rl = readline.createInterface(instream, outstream);
    return rl;
}

function readLinesFromFileToArray(inputFile, from, amount) {
    return new Promise((_resolve) => {
        const rl = processFile(inputFile);
        let count = 0;
        const arr = [];
        from = from || 0;
        amount = amount || Infinity;
        rl.on('line', function (line) {
            if (count >= from && count < from + amount) {
                arr.push(parseInt(line, 10));
            }
            if (count >= from + amount) { 
                rl.close();
            }
            count++;
        });
        
        rl.on('close', function () {
            _resolve(arr);
        });
    });
}

const file = path.resolve(__dirname, 'test_file.txt');
/*readLinesFromFileToArray(file, 0).then((a) => {
    const res = countAndSort(a);
    console.log(res[0]);
});
*/
countAndSort([5, 3, 8, 9, 1, 7, 0, 2, 6, 4])
