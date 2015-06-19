(function(){
    function solve() {
        var library = (function () {
            var books = [],
                categories = [];

            function listBooks() {
                var args,
                    key,
                    value,
                    keyValuePair,
                    retArr;

                if (books.length === 0) {
                    return [];
                }

                args = [].slice.apply(arguments);

                if (args.length !== 1) {
                    return books.slice();
                }

                // if there is a search criterion (only books of specific author or category)
                keyValuePair = args[0];
                key = Object.keys(keyValuePair)[0];
                value = keyValuePair[key];

                return books.filter(function (b) {
                    if (b[key] === value) {
                        return b;
                    }
                });
            }

            function addBook(book) {
                validateBook(book);

                // if new category - add
                if (categories.indexOf(book.category) === -1) {
                    categories.push(book.category);
                }

                book.ID = books.length + 1;
                books.push(book);
                return book;
            }

            function listCategories() {
                return categories;
            }

            return {
                books: {
                    list: listBooks,
                    add: addBook
                },
                categories: {
                    list: listCategories
                }
            };

            // additional functions
            function validateBook(book){
                var propsExist = doPropsExist(book),
                    isbn,
                    valueAlreadyExists;

                if (propsExist === false) {
                    throw new Error('Missing book info - title, isbn, author and category required.');
                }

                // check title
                if (typeof book.title !== 'string' || validateStringLength(book.title.trim(), 2, 100) === false) {
                    throw new Error('Invalid title. Expected: string. Expected length: 2 to 100 characters.');
                }

                valueAlreadyExists = books.some(function (b) {
                    return b.title === book.title;
                });
                if (valueAlreadyExists === true) {
                    throw new Error('A book with the same title already exists.');
                }

                // check category
                if (typeof book.category !== 'string' || validateStringLength(book.category.trim(), 2, 100) === false) {
                    throw new Error('Invalid category. Expected: string. Expected length: 2 to 100 characters.');
                }

                // check ISBN
                isbn = book.isbn;
                if (isNaN(isbn) === true || (isbn.toString().length !== 10 && isbn.toString().length !== 13)) {
                    throw new Error('Invalid ISBN. Code must be 10 or 13 digits.');
                }

                valueAlreadyExists = books.some(function (b) {
                    return b.isbn === isbn;
                });
                if (valueAlreadyExists === true) {
                    throw new Error('ISBN already exists in library.');
                }

                // check author
                if (typeof book.author !== 'string' || book.author.trim().length < 1) {
                    throw new Error('Invalid author. Expected: non-empty string.');
                }
            }

            function doPropsExist(obj){
                if (checkProperty(obj, 'title') === false || checkProperty(obj, 'isbn') === false ||
                    checkProperty(obj, 'author' === false || checkProperty(obj, 'category') === false)) {
                    return false;
                }

                return true;
            }

            function checkProperty(obj, prop){
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }

            function validateStringLength(str, minLength, maxLength){
                if (str == null) {
                    return false;
                }

                if (str.length < minLength || str.length > maxLength) {
                    return false;
                }

                return true;
            }

        } ());
       return library;
    }
}());
//module.exports = solve;

// Check for property existence -> http://adripofjavascript.com/blog/drips/the-uses-of-in-vs-hasownproperty.html