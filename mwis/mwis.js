const path = require('path')
const {readFileAsArray} = require('../utils/fs');

function maxWeighteIndependentdSet(list) {
    let res = [0, list[0]]
    for (let i = 2; i <= list.length; i++) {
        res[i] = Math.max(res[i - 1], res[i - 2] + list[i - 1])
        console.log('i-1: ', res[i - 1], 'i-2:', res[i - 2], 'vi:', list[i - 1], 'res', res[i])
    }
    console.log('resulted line', ...res)
    let set = []
    let i = res.length - 1
    while(i >= 1) {
        if (res[i] === res[i - 1]) {
            i--
        } else {
            set.push(list[i - 1])
            i-=2
        }
    }
    console.log('set of vertices', ...set.reverse())
    return set
}

function test(file) {
    readFileAsArray(path.resolve(__dirname, file))
    .then(list => {
        const vertices = [1, 2, 3, 4, 17, 117, 517, 997].map(d => list[d - 1])
        console.log('look for vertices', ...vertices)
        const set = maxWeighteIndependentdSet(list);

        const answer = vertices.map(d => d && set.includes(d) ? 1 : 0).join('')
        console.log(answer);
    });
}

test('data/mwis.txt'); // 10100110
