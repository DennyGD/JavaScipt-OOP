/*
Write a function that finds all the prime numbers in a range

It should return the prime numbers in an array
It must throw an Error if any of the range params is not convertible to Number
It must throw an Error if any of the range params is missing
*/

function getPrimeNumbers(startNum, endNum){
    if (arguments.length !== 2) {
        throw new Error('Invalid number of arguments. Expected: two.');
    }

    var start = parseInt(startNum),
        end = parseInt(endNum),
        arr,
        divider,
        maxDivider,
        currNumber,
        isPrime;

    if (isNaN(start) || isNaN(end)) {
        throw new Error('NaN encountered.');
    }

    arr = [];

    if (start < 2) {
        start = 2;
    }

    for (var i = start; i <= end; i += 1) {
        currNumber = i;
        divider = 2;
        maxDivider = Math.sqrt(currNumber);
        isPrime = true;

        while (divider <= maxDivider) {
            if (currNumber % divider === 0) {
                isPrime = false;
                break;
            }
            divider += 1;
        }

        if (isPrime) {
            arr.push(currNumber);
        }

    }

    return arr;
}