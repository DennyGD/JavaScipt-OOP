function solve() {
    var Person = (function () {
        function Person(firstName, lastName, age) {
            this.firstname = firstName;
            this.lastname = lastName;
            this.age = age;
        }

        Object.defineProperty(Person.prototype, 'firstname',{
            get: function() {
                return this._firstname;
            },
            set: function(value) {
                if (isNameValid(value) === false) {
                    throw new Error('Invalid first name. Expected: 3 to 20 characters, Latin letters only.');
                }
                this._firstname = value;
            }

        });

        Object.defineProperty(Person.prototype, 'lastname',{
            get: function() {
                return this._lastname;
            },
            set: function(value) {
                if (isNameValid(value) === false) {
                    throw new Error('Invalid first name. Expected: 3 to 20 characters, Latin letters only.');
                }
                this._lastname = value;
            }
        });

        Object.defineProperty(Person.prototype, 'fullname', {
            get: function() {
                return this._firstname + ' ' + this._lastname;
            },
            set: function(value) {
                var names = value.split(' ');
                this.firstname = names[0];
                this.lastname = names[1];
            }
        });

        Object.defineProperty(Person.prototype, 'age', {
            get: function() {
                return this._age;
            },
            set: function(value) {
                if (isNaN(value)) {
                    throw new Error('Age must be a number.');
                }

                if (parseInt(value) < 0 || parseInt(value) > 150) {
                    throw new RangeError('Age must be in the range 0-150.');
                }

                this._age = parseInt(value);
            }
        });

        Person.prototype.introduce = function () {
            return 'Hello! My name is ' + this.fullname + ' and I am ' + this.age + '-years-old';
        }

        function isNameValid(str){
            var areLatinLetters;

            // check for empty, null, undefined and typeof
            if (!str || typeof str !== 'string') {
                return false;
            }

            if (str.length < 3 || str.length > 20) {
                return false;
            }

            areLatinLetters = str.split('').every(function (ch) {
                var currCode = ch.charCodeAt(0);
                return  (currCode >= 65 && currCode <= 90) || (currCode >= 97 && currCode <= 122);
            });

            if (!areLatinLetters) {
                return false;
            }

            return true;
        }

        return Person;
    } ());
    return Person;
}
//module.exports = solve;
