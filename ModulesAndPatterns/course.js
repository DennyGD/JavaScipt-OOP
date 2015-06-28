function solve() {
    var Course = (function () {
        var Course = {
            init: function (title, presentations) {
                var that = this;
                that.title = title;
                that.presentations = presentations;
                that._studentsData = [];
                return that;
            },
            addStudent: function (name) {
                var that = this,
                    names,
                    student,
                    id;

                if (!name) {
                    throw new Error('Null, undefined or an empty string passed as an argument to addStudent().');
                }

                names = name.split(' ').filter(function (item) {
                    return item;
                });

                if (names.length !== 2) {
                    throw new Error('Invalid student name. Expected: first and last name as a single string.');
                }

                validateName(names[0]);
                validateName(names[1]);

                id = that._studentsData.length + 1;
                student = {
                    firstname: names[0],
                    lastname: names[1],
                    id: id,
                    homeworks: [],
                    examScore: -1,
                    finalScore: -1
                };
                that._studentsData.push(student);
                return id;
            },
            getAllStudents: function () {
                var studentsBasicData = [];

                this._studentsData.forEach(function (student) {
                    var basicInfo = {
                        firstname: student.firstname,
                        lastname: student.lastname,
                        id: student.id
                    };

                    studentsBasicData.push(basicInfo);
                });

                return studentsBasicData;
            },
            submitHomework: function (studentID, homeworkID) {
                var that = this,
                    currentStudent;

                validateInteger(studentID);
                validateInteger(homeworkID);

                studentID *= 1;
                homeworkID *= 1;

                if (studentID < 1 || studentID > that._studentsData.length) {
                    throw new Error('Student ID not found.');
                }

                if (homeworkID < 1 || homeworkID > that.presentations.length) {
                    throw new Error('Homework ID not found.');
                }

                currentStudent = that._studentsData[studentID - 1];

                // consider changing it to throw Error (if homework is already submitted)
                if (currentStudent.homeworks.indexOf(homeworkID) === -1) {
                    currentStudent.homeworks.push(homeworkID);
                }

                return that;
            },
            pushExamResults: function (results) {
                var that = this,
                    resultsLength,
                    currentId,
                    currentScore;

                if (!results) {
                    throw new Error('Null or undefined passed as an argument to pushExamResults()');
                }

                resultsLength = results.length;

                for (var i = 0; i < resultsLength; i += 1) {
                    currentId = results[i].StudentID;
                    currentScore = results[i].Score;

                    validateInteger(currentId);
                    if (isNaN(currentScore)) {
                        throw new Error('NaN encountered [pushExamResults()].');
                    }

                    currentId *= 1;
                    currentScore *= 1;

                    if (currentId < 1 || currentId > that._studentsData.length) {
                        throw new Error('Student ID not found.');
                    }

                    if (that._studentsData[currentId - 1].examScore !== -1) {
                        throw new Error("Cheater found. Student's score has already been set.");
                    }

                    that._studentsData[currentId - 1].examScore = currentScore;
                }

                return that;
            },
            getTopStudents: function () {
                var that = this,
                    studentsCount = 10,
                    topStudentsBasicData = [],
                    basicInfo;

                setFinalScore.call(that);

                that._studentsData.sort(function (a, b) {
                    return b.finalScore - a.finalScore;
                });

                if (that._studentsData.length < 10) {
                    studentsCount = that._studentsData.length;
                }

                for (var i = 0; i < studentsCount; i += 1) {
                    basicInfo = {
                        firstname: that._studentsData[i].firstname,
                        lastname: that._studentsData[i].lastname,
                        id: that._studentsData[i].id
                    };

                    topStudentsBasicData.push(basicInfo);
                }

                return topStudentsBasicData;
            }
        };

        Object.defineProperty(Course, 'title', {
           get: function() {
               return this._title;
           },
            set: function(value) {
                validateTitle(value);
                this._title = value;
            }
        });

        Object.defineProperty(Course, 'presentations', {
            get: function() {
                return this._presentations;
            },
            set: function(value) {
                validatePresentations(value);
                this._presentations = value;
            }
        });

        // private functions
        function validatePresentations(arr) {
            var arrLength;

            if (Array.isArray(arr) === false || arr.length === 0) {
                throw new Error('Invalid presentations. Expected: a non-empty array.');
            }

            arrLength = arr.length;

            for (var i = 0; i < arrLength; i += 1) {
                validateTitle(arr[i]);
            }
        }

        function validateTitle(str) {
            var firstChar,
                lastChar,
                strSplitByWhitespaces,
                numberOfExtraWhitespaces;

            if (!str || typeof str !== 'string') {
                throw new Error('Invalid title. Expected: a non-empty string.');
            }

            firstChar = str[0];
            lastChar = str[str.length - 1];

            if (firstChar === ' ' || lastChar === ' ') {
                throw new Error('Title must not start or end with a whitespace.');
            }

            strSplitByWhitespaces = str.split(' ');

            numberOfExtraWhitespaces = strSplitByWhitespaces.filter(function (item) {
                return !item;
            }).length;

            if (numberOfExtraWhitespaces > 0) {
                throw new Error('Invalid title. Consecutive whitespaces not allowed.');
            }
        }

        function validateName(str) {
            var letterCharCode,
                strLength;

            if (!str || typeof str !== 'string') {
                throw new Error('Invalid name. Expected: a non-empty string.');
            }

            letterCharCode = str.charCodeAt(0);

            if (letterCharCode < 65 || letterCharCode > 90) {
                throw new Error('Invalid name. Expected: string starting with a capital letter.');
            }

            strLength = str.length;
            for (var i = 1; i < strLength; i += 1) {
                letterCharCode = str.charCodeAt(i);
                if (letterCharCode < 97 || letterCharCode > 122) {
                    throw new Error('Invalid name. Expected: all letters, except the first one, to be lowercase.');
                }
            }
        }

        function validateInteger(number) {
            if (!number) {
                throw new Error('Null or undefined passed as an argument instead of integer.');
            }

            if (isNaN(number)) {
                throw new Error('NaN passed as an argument instead of integer.');
            }

            if (number % 1 !== 0) {
                throw new Error('Floating-point number passed as an argument instead of integer.');
            }
        }

        function setFinalScore() {
            var totalHomeworks = this.presentations.length,
                homeworkScore;

            this._studentsData.forEach(function (student) {
                if (student.examScore === -1) {
                    student.examScore = 0;
                }

                homeworkScore = student.homeworks.length / totalHomeworks;
                student.finalScore = (0.75 * student.examScore) + (0.25 * homeworkScore);
            });
        }

        return Course;
    }());

    return Course;
}

//module.exports = solve;
