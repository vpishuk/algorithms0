function karatsuba(num1, num2, step = 0) {
    let log = ['\n'];
    log.push('-------');
    num1 = num1.replace(/^[0]+/g, '');
    num2 = num2.replace(/^[0]+/g, '');
    log.push([`Step (${step}):`, 'num1 =', num1, 'num2 =', num2].join(' '));
    if (num1.length <= 1 || num2.length <= 1) {
      let res = (parseInt(num1 || 0, 10)*parseInt(num2 || 0, 10)).toString();
      log.push([`Step (${step}):`, 'result =', res].join(' '));
      return res;
    }
    let max = Math.max(num1.length, num2.length);
    if (max % 2 > 0) {
        max++;
    }
    num1 = '0'.repeat(max - num1.length) + num1;
    num2 = '0'.repeat(max - num2.length) + num2;
    log.push([`Step (${step}):`, 'num1 =', num1, 'num2 =', num2].join(' '));
    const half = Math.floor(max / 2);
    const high1 = num1.substr(0, half) || '0';
    const low1 = num1.substr(half) || '0';
    const high2 = num2.substr(0, half) || '0';
    const low2 = num2.substr(half) || '0';
    log.push([`Step (${step}):`, 'max =', max, 'half =', half, 'low1 =', low1, 'high1 = ', high1, 'low2 =', low2, 'high2 =', high2].join(' '));
    const z1_0 = sumStrings(low1, high1);
    log.push([`Step (${step}):`, 'z1_0 = low1 + high1 =', z1_0].join(' '));
    const z1_1 = sumStrings(low2, high2);
    log.push([`Step (${step}):`, 'z1_1 = low2 + high2 =', z1_1].join(' '));
    const z0 = karatsuba(low1, low2, step+1);
    log.push([`Step (${step}):`, 'z0 = low1 * low2 =', z0].join(' '));
    const z1 = karatsuba(z1_0, z1_1, step+1);
    log.push([`Step (${step}):`, 'z1 = z1_0 * z1_1 =', z1].join(' '));
    const z2 = karatsuba(high1, high2, step+1);
    log.push([`Step (${step}):`, 'z2 = high1 * high2 =', z2].join(' '));
    const x1 = z2 + '0'.repeat(half*2);
    log.push([`Step (${step}):`, 'x1 =', x1].join(' '));
    const x2 = minusStrings(minusStrings(z1, z2), z0) + '0'.repeat(half);
    log.push([`Step (${step}):`, 'x2 = z1 - z2 - z0 =', x2].join(' '));
    const result = sumStrings(sumStrings(x1, x2), z0);
    log.push([`Step (${step}):`, 'result = x1 + x2 + z0 = ', result].join(' '));
    //console.log(log.join('\n'));
    return result.replace(/^[0]*/g, '');
  }
  function sumStrings(num1, num2) {
    if (num1.length <= 1 || num2.length <= 1) {
        return (parseInt(num1 || 0, 10) + parseInt(num2 || 0, 10)).toString();
    }
    const up = num1.length > num2.length ? num1 : num2;
    const down = num1.length > num2.length ? num2 : num1;
    let res = '';
    let increment = 0;
    for (let i = up.length - 1, k = down.length - 1; i >= 0; i--, k--) {
        let sum = parseInt(up[i] || 0, 10) + parseInt(down[k] || 0, 10) + increment;
        if (sum >= 10 && i > 0) {
            res = (sum - 10).toString() + res;
            increment = 1;
        } else {
            res = (sum).toString() + res;
            increment = 0;
        }
    }
    return res;
  }

  function minusStrings(num1, num2) {
    if (num1.length <= 1 || num2.length <= 1) {
        return (parseInt(num1, 10) - parseInt(num2, 10)).toString();
    }
    let res = '';
    let decrement = 0;
    for (let i = num1.length - 1, k = num2.length - 1; i >= 0; i--, k--) {
        let upDigit = parseInt(num1[i], 10) - decrement;
        let downDigit = parseInt(num2[k] || 0, 10);
        if (upDigit === 0 && i === 0) {
            break;
        }
        if (upDigit >= downDigit) {
            decrement = 0;
        } else {
            decrement = 1;
            upDigit = upDigit +  10;
        }
        let sum = Math.abs(upDigit - downDigit);
        res = sum.toString() + res;
    }
    return res;
  }

  //const diff0 = minusStrings('5678', '1234');
  //console.log('diff 5678-1234 =', diff0, 'should eq to', (5678-1234), (5678-1234) === parseInt(diff0, 10));

  //const diff1 = minusStrings('105', '21');
  //console.log('diff 105-21 =', diff1, 'should eq to', (105-21), (105-21) === parseInt(diff1, 10));

  //const diff2 = minusStrings('84', '32');
  //console.log('diff 84-32 =', diff2, 'should eq to', (84-32), (84-32) === parseInt(diff2, 10));
  //console.log(minusStrings(minusStrings('105', '21'), '32'));


  //const sum2 = sumStrings('78', '56');
  //console.log('sum 78+56 =', sum2, 'should eq to', (78+56), (78+56) === parseInt(sum2, 10));

  //const sum = sumStrings('1234', '5678');
  //console.log('sum 1234+5678 =', sum, 'should eq to', (1234+5678), (1234+5678) === parseInt(sum, 10));

  //const sum2 = sumStrings('78', '56');
  //console.log('sum 78+56 =', sum2, 'should eq to', (78+56), (78+56) === parseInt(sum2, 10));
  //console.log(sumStrings(sumStrings('2100', '520'), '32'));
  //console.log(sumStrings('1820', '204'));


  //const m0 = karatsuba('34', '78');
  //console.log('multiply 34*78 =', m0, 'should eq to', 34*78, parseInt(m0, 10) === 34*78);

  //const m0 = karatsuba('12', '34');
  //console.log('multiply 12*34 =', m0, 'should eq to', 12*34, parseInt(m0, 10) === 12*34);

  //const m1 = karatsuba('1234', '5678');
  //console.log('multiply 1234*5678 =', m1, 'should eq to', 1234*5678, parseInt(m1, 10) === 1234*5678);

  //const m2 = karatsuba('46', '134');
  //console.log('multiply 46*134 =', m2, 'should eq to', 46*134, parseInt(m2, 10) === 46*134);

  function runKaratsuba(num1, num2) {
    const m2 = karatsuba(num1, num2);
    const expected = parseInt(num1,10)*parseInt(num2, 10);
    if (parseInt(m2, 10) === expected) {
        //console.log(`multiply ${num1}*${num2} =`, m2, 'should eq to', expected, parseInt(m2, 10) === expected);
    } else {
        console.log(`multiply ${num1}*${num2} =`, m2, 'should eq to', expected, parseInt(m2, 10) === expected);
        console.error(new Error('failed'));
        process.exit(1);
    }
  }

  runKaratsuba('34', '78');
  runKaratsuba('12', '34');
  runKaratsuba('1', '134');
  runKaratsuba('46', '134');
  runKaratsuba('1234', '5678');
  runKaratsuba('1234', '567');
  runKaratsuba('1234555555', '22');
  runKaratsuba('1234555555', '0005678299000');
  runKaratsuba('3243243424234', '45745745745747');
  /*console.log(karatsuba(
      '3141592653589793238462643383279502884197169399375105820974944592', 
      '2718281828459045235360287471352662497757247093699959574966967627'
    ));*/
    console.log(3141592653589793238462643383279502884197169399375105820974944592*2718281828459045235360287471352662497757247093699959574966967627);