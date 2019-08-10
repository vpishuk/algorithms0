const path = require('path')
const {readFileAsMatrixWithDefinition} = require('../utils/fs');

function knapsack(list, knapsackSize) {
    let res = new Array(knapsackSize)
    let newRes = new Array(knapsackSize)
    let n = list.length
    for (let i = 1; i <= n; i++) {
        let [value, weight] = list[i - 1]
        for (let k = 0; k <= knapsackSize; k++) {
            let left = res[k] || 0
            let right = k >= weight ? (res[k - weight] || 0) + value : 0
            newRes[k] = Math.max(left, right)
            // console.log('i =', i, 'k =', k, 'elem', list[i - 1], 'A[i - 1][x]', left, 'A[i - 1][x - Wi]', right)
            // console.log(res)
            // console.log('-------------\n\n')
        }
        res = newRes
        newRes = new Array(knapsackSize)
    }
    //console.log(res)
    return res[knapsackSize]
}

function test(file, res) {
    readFileAsMatrixWithDefinition(path.resolve(__dirname, file))
    .then(([[knapsackSize], list]) => {
        const answer = knapsack(list, knapsackSize);
        console.log(answer, res === answer);
    });
}
// 2493893
test('data/knapsack1.txt', 2493893);
//4243395
test('data/knapsack_big.txt', 4243395);
