const {RedBlackTree, readFile} = require('./utils');


function medianMaitenance() {
    const a = new RedBlackTree();
    readFile('median.txt', (l) => {
        //sum += a.getMedian();
        //a.print();
        return parseInt(l, 10)
    }).then((res) => {
        console.log('read done')
        res.forEach(e => {
            console.log('insert', e)
            if (e) {
                a.insert(e)
                a.print();
            }
            console.log('insert', e, 'done')
        });
        console.log('insert done')
        a.print()
        //console.log(res.join('   '));
        ///console.log(res[res.length - 1] % 10000);
    }).catch(e => {
        console.error(e);
        a.print();
    });
}

medianMaitenance();
/*
const a = new RedBlackTree();
for (let i =0; i < 14; i++) {
    a.insert(i)
}
a.print()*/