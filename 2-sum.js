const {readFile} = require('./utils');


function twoSumProblem() {
    const set = new Set();
    const notVisited = new Set();
    notVisited.add(0)
    for (let i = 1; i <= 10000; i++) {
        notVisited.add(i)
    }
    readFile('2-sum.txt', (l) => {
        set.add(parseInt(l, 10))
        return;
    }).then((res) => {
        let counter = 0
        const notVisitedValues = notVisited.values()
        let notVisitedValuesNext = notVisitedValues.next()
        
        while (!notVisitedValuesNext.done) {
            const values = set.values()
            let next = values.next()
            let shouldBreak = [false, notVisitedValuesNext.value === 0];
            while(!next.done) {
                if (!shouldBreak[0] && set.has(notVisitedValuesNext.value - next.value)) {
                    counter++;
                    shouldBreak[0] = true
                }
                if (!shouldBreak[1] && set.has(0 - notVisitedValuesNext.value - next.value)) {
                    counter++;
                    shouldBreak[1] = true
                }
                if (shouldBreak[0] && shouldBreak[1]) {
                    break;
                }
                next = values.next()
            }
            console.log('visited:', notVisitedValuesNext.value, 'counter', counter)
            notVisitedValuesNext = notVisitedValues.next()
        }
        console.log(counter)
    }).catch(e => {
        console.error(e);
    });
}

twoSumProblem();