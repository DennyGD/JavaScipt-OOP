
/*
Write a function that sums an array of numbers:
Numbers must be always of type Number
Returns null if the array is empty
Throws Error if the parameter is not passed (undefined)
Throws if any of the elements is not convertible to Number
*/


function sumNumbers (arr) {
    var sum,
        numbers,
        allAreNumbers;

    if (arr === undefined) {
        throw new Error('Parameter is undefined.');
    }

    if (arr.length === 0) {
        return null;
    }

    numbers = arr.map(Number);

    allAreNumbers = numbers.every(function (item) {
        return isNaN(item) === false;
    });

    if (!allAreNumbers) {
        throw new Error('NaN encountered.');
    }

    sum = numbers.reduce(function (total, num) {
        return total + num
    }, 0);

    return sum;
}


