const readline = require('readline');
const path = require('path');
const fs = require('fs');

const DEBUG = 1;

function QuickSort(arr, elemMethod = 'median', start = null, end = null) {
   end = end === null ? arr.length : end;
   start = start || 0;
   let amountOfComparisons = end - start - 1;
   if (end - start <= 1) {
       return 0;
   }
   if (DEBUG) {
   console.log('\n');
   console.log('input array:', arr.slice(start, end), '(', arr.slice(start, end).length, ')');
   }
   if (elemMethod === 'last') {
       swapBToA(arr, end - 1, start);
   } else if (elemMethod === 'median') {
       const median = applyMedianOfThreeRule(arr, start, end - 1);
       if (median != start) {
        if (DEBUG) {
            console.log('swap median:', start, median);
        }
        swapBToA(arr, start, median);
       }
   }
   if (DEBUG) {
   console.log('amountOfComparisons:', amountOfComparisons);
   }
   let i = start;
   let k = start + 1;
   let j = start + 1;
   for (; k < end; k++) {
       if (arr[k] < arr[start]) {
           i++;
           if (i < j) {
               swapBToA(arr, k, i);
           }
       }
       j++;
   }
   if (i !== start) {
       swapBToA(arr, start, i);
   }
   if (DEBUG) {
        console.log('result:', arr);
        console.log('----');
   }
   if (i - start >= 0) {
       amountOfComparisons += QuickSort(arr, elemMethod, start, i);
   } else {
       console.log(arr);
       console.log('ALERT', i, start);
   }

       amountOfComparisons += QuickSort(arr, elemMethod, i + 1, end);
   DEBUG && console.log('TOTAL', amountOfComparisons);
   return amountOfComparisons;
}

function applyMedianOfThreeRule(arr, start, end) {
   const mid = Math.floor((end - start) / 2) + start;
   if (DEBUG) {
    console.log('start:', arr[start], `(${start})`, ';', 'end:', arr[end], `(${end})`, 'mid:', arr[mid], `(${mid})`);
    }
    if (arr[mid] > arr[end] && arr[mid] < arr[start] || arr[mid] > arr[start] && arr[mid] < arr[end]) {
        DEBUG && console.log('(m1) median:', mid, arr[mid]);
        return mid;
    }
    if (arr[start] > arr[mid] && arr[start] < arr[end] || arr[start] > arr[end] && arr[start] < arr[mid]) {
        DEBUG && console.log('(m2) median:', start, arr[start]);
        return start;
    }
    if (arr[end] > arr[mid] && arr[end] < arr[start] || arr[end] > arr[start] && arr[end] < arr[mid]) {
        DEBUG && console.log('(m3) median:', end, arr[end]);
        return end;
    }
   return start;
}

function swapBToA(arr, k, i) {
   arr[k] = arr[k] + arr[i];
   arr[i] = arr[k] - arr[i];
   arr[k] = arr[k] - arr[i];
}

function matches(arr1, arr2) {
   return arr1.every((e, i) => arr2[i] === e);
}

function test(name, sortFn, arr, expected, expCount) {
   const unsorted = arr.slice(0);
   const count = QuickSort(unsorted, sortFn);
   if (!matches(unsorted, expected)) {
       console.log('FALSE!!!!', sortFn, count);
   } else {
       if (expCount !== count) {
           console.log('FAILED!!!', name, 'requires', count, 'comparisons, but expects', expCount);
       } else {
           console.log(name, 'requires', count, 'comparisons');
       }
   }

}

function readFile(file) {
   return new Promise((_resolve) => {
       const arr = [];
       const lineReader = readline.createInterface({
           input: fs.createReadStream(file)
       });

       lineReader.on('line', (line) => {
           arr.push(parseInt(line, 10));
       });

       lineReader.on('close', () => {
           _resolve(arr);
       });
   });
}

function range(i) {
   const x = [];
   let k = 1;
   while (x.push(k++) < i) { };
   return x;
}

function doYourBest(file, results) {
   readFile(path.resolve(__dirname, file))
       .then((unsorted) => {
           const arr = range(10000);
           test('QuickSortByFirst', 'first', unsorted, arr, results[0]);
           test('QuickSortByLast', 'last', unsorted, arr, results[1]);
           test('QuickSortByMedian', 'median', unsorted, arr, results[2]);
       });
}

function testArr(unsorted, results) {
    if (DEBUG) {
    console.log('-------');
    console.log(unsorted);
    }
    const arr = range(unsorted.length);
    test('QuickSortByFirst', 'first', unsorted, arr, results[0]);
    test('QuickSortByLast', 'last', unsorted, arr, results[1]);
    test('QuickSortByMedian', 'median', unsorted, arr, results[2]);
}

console.log(QuickSort([3, 1, 2, 4, 5, 8, 7, 6, 9], 'last'));

//const check =  [2, 20, 1, 15, 3, 11, 13, 6, 16, 10, 19, 5, 4, 9, 8, 14, 18, 17, 7, 12];
//console.log('total count:', QuickSort(check));
//console.log(check);
//console.log(matches(check, range(20)));


//test('median', QuickSortByMedian, [3, 8, 7, 2, 5, 4, 1, 6], [1, 2, 3, 4, 5, 6, 7, 8]);
//test('median', QuickSortByLast, [7, 8, 3, 2, 5, 4, 1, 6], [1, 2, 3, 4, 5, 6, 7, 8]);
//test('median', QuickSortByLast, [3, 1, 7, 2, 5, 4, 8, 6], [1, 2, 3, 4, 5, 6, 7, 8]);
//test('median', QuickSortByLast, [3, 8, 7, 1, 4, 6, 2, 5], [1, 2, 3, 4, 5, 6, 7, 8]);
//test('median', QuickSortByLast, [3, 8, 7, 2, 5, 4, 1, 6], [1, 2, 3, 4, 5, 6, 7, 8]);
//doYourBest('qsort.txt', [162085, 164123, 138382]);
//doYourBest('qsort2.txt');
//console.log(applyMedianOfThreeRule([1, 2], 0, 1) === 0);
//console.log(applyMedianOfThreeRule([2, 1], 0, 1), applyMedianOfThreeRule([2, 1], 0, 1) === 1);
//console.log(applyMedianOfThreeRule([3, 1, 2], 0, 2) === 2);
//console.log(applyMedianOfThreeRule([1, 2, 3], 0, 2) === 1);
//console.log(applyMedianOfThreeRule([2, 1, 3], 0, 2) === 0);
//console.log(applyMedianOfThreeRule([2, 1, 3, 4], 0, 3) === 0);
//console.log(applyMedianOfThreeRule([1, 2, 3, 4], 0, 3) === 1);
//const arr = [8, 2, 1, 5, 7, 4];
//console.log(applyMedianOfThreeRule(arr, 0, 5));
//console.log(arr);
//swapBToA(arr, 0, 5)
//console.log(arr);

//testArr([3, 2, 1, 4, 5], [6, 10, 6]);
//testArr([4, 3, 2, 5, 1], [7, 8, 6]);
//testArr([2,5,1,3,4], [7, 7, 6]);
//testArr([4,1,2,5,3], [7, 6, 6]);

