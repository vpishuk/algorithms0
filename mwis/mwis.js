const path = require('path')
const {readFileAsArray} = require('../utils/fs');

function maxWeighteIndependentdSet(list) {
    let res = [0, list[0]]
    for (let i = 2; i <= list.length; i++) {
        res[i] = Math.max(res[i - 1], res[i - 2] + list[i - 1])
        console.log('i-1: ', res[i - 1], 'i-2:', res[i - 2], 'vi:', list[i - 1], 'res', res[i])
    }
    let set = []
    let i = res.length
    while(i >= 1) {
        if (res[i - 1] >= res[i - 2] + list[i]) {
            i--
        } else {
            set.push(list[i])
            i-=2
        }
    }
    return set
}

function test(file) {
    readFileAsArray(path.resolve(__dirname, file))
    .then(list => {
        const set = maxWeighteIndependentdSet(list);
        const vertices = [1, 2, 3, 4, 17, 117, 517, 997].map(d => list[d])
        console.log(...Array.from(set).reverse())
        console.log(...vertices)
        const answer = vertices.map(d => set.includes(d) ? 1 : 0).join('')
        console.log(answer);
    });
}

test('data/test.txt'); // 10010000 ?
