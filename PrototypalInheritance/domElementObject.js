function solve() {
    var domElement = (function () {
        var domElement = {
            init: function(type) {
                var that = this;
                if (validateString(type, checkCharIfLatinLetter, checkCharIfDigit) === false) {
                    throw new Error('Invalid type of domElement. Expected: string containing Latin letters or digits.');
                }

                that.type = type;
                that.attributes = [];
                that.children = [];
                that.parent;
                that.content = '';
                return that;
            },
            appendChild: function(child) {
                if (typeof child !== 'string' && domElement.isPrototypeOf(child)=== false) {
                    throw new Error('Invalid child. Expected: string or domElement.');
                }

                child.parent = this;
                this.children.push(child);
                return this;
            },
            addAttribute: function(name, value) {
                if (validateString(name, checkCharIfLatinLetter, checkCharIfDigit, function (ch){return ch === '-'}) === false) {
                    throw new Error('Invalid attribute name. Expected: string containing Latin letters, digits or dashes.');
                }

                var that = this,
                    attributeToAdd = {},
                    nameExists = false;

                // expect repeating attribute name to hold only the last value
                that.attributes.some(function (obj) {
                    var currKey = Object.keys(obj)[0];
                    if (name === currKey) {
                        obj[currKey] = value + '';
                        nameExists = true;
                    }
                });

                if (!nameExists) {
                    attributeToAdd[name] = value + '';
                    that.attributes.push(attributeToAdd);
                }

                return that;
            },
            removeAttribute: function(attribute){
                var that = this,
                    attributesLength = that.attributes.length,
                    editedAttributes;

                editedAttributes = that.attributes.filter(function (item) {
                    return !(item.hasOwnProperty(attribute))
                });

                if (attributesLength === editedAttributes.length) {
                    throw new Error('Attribute does not exist.');
                }

                that.attributes = editedAttributes.slice();
                return that;
            },
            get innerHTML(){
                var generatedInnerHtml = generateInnerHtml.call(this),
                    indexClosingTagStart,
                    indexPreviousTagEnd,
                    innerHtmlWithoutParentContent;

                // expect domElement children to override parent\'s content
                if (this.children.length > 0 && this.content) {
                    indexClosingTagStart = generatedInnerHtml.lastIndexOf('</');
                    indexPreviousTagEnd = generatedInnerHtml.lastIndexOf('>', indexClosingTagStart);
                    innerHtmlWithoutParentContent = generatedInnerHtml.substring(0, indexPreviousTagEnd + 1) +
                            generatedInnerHtml.substring(indexClosingTagStart);

                    generatedInnerHtml = innerHtmlWithoutParentContent;
                }

                return generatedInnerHtml;
            }
        };

        Object.defineProperty(domElement, 'content', {
            get: function() {
                return this._content;
            },
            set: function(value) {
                if (this.children.length === 0) {
                    this._content = value;
                    return this;
                }
            }
        });

        // private functions

        // Takes as first parameter a string. The others must be functions intended to test a char(length of string: 1)
        // against a certain condition.
        function validateString(){
            var args = [].slice.apply(arguments),
                str = args[0],
                isValidSymbol = false,
                charTypeOptions,
                charTypeOptionsLength,
                stringLength,
                currentChar;

            if (!str || typeof str !== 'string') {
                return false;
            }

            stringLength = str.length;
            charTypeOptions = args.slice(1);
            charTypeOptionsLength = charTypeOptions.length;

            for (var i = 0; i < stringLength; i += 1) {
                currentChar = str[i];

                for (var j = 0; j < charTypeOptionsLength; j += 1) {
                    isValidSymbol = charTypeOptions[j](currentChar);

                    // if the char matches any of the possible symbol types(digits, Latin letters, etc.), continue the check
                    // with the next char
                    if (isValidSymbol) {
                        break;
                    }
                }

                if (!isValidSymbol) {
                    return false;
                }

                isValidSymbol = false;
            }

            return true;
        }

        function checkCharIfLatinLetter(ch){
            var charCode = ch.toLowerCase().charCodeAt(0);

            return charCode >= 97 && charCode <= 122;
        }

        function checkCharIfDigit(ch){
            var charCode = ch.charCodeAt(0);

            return charCode >= 48 && charCode <= 57;
        }

        function sortArrayOfObjectsByKeyName(arr){
            if (Array.isArray(arr) === false || arr.length === 0) {
                throw new Error('Invalid argument passed to sortArrayOfObjectsByKeyName(). Expected: non-empty array.');
            }

            var sortedArr = arr.slice();

            sortedArr.sort(function (a, b) {
                var firstKey = Object.keys(a)[0],
                    secondKey = Object.keys(b)[0];

                return firstKey > secondKey;
            });

            return sortedArr;
        }

        function generateInnerHtml(){
            var that = this,
                innerHtml = '',
                outerTag = that.type,
                childrenLength = that.children.length,
                currentChild;

            innerHtml += '<' + outerTag;
            if (that.attributes.length > 0) {
                innerHtml += ' ';
                innerHtml += getStringOfAttributes.call(that);
            }

            innerHtml += '>';

            for (var i = 0; i < childrenLength; i += 1) {
                currentChild = that.children[i];

                if (typeof currentChild === 'string') {
                    innerHtml += currentChild;
                    continue;
                }

                if (currentChild.children.length > 0) {
                    innerHtml += generateInnerHtml.call(currentChild);
                    continue;
                }

                innerHtml += '<' + currentChild.type;

                if (currentChild.attributes.length > 0) {
                    innerHtml += ' ';
                    innerHtml += getStringOfAttributes.call(currentChild);
                }

                innerHtml += '>';
                if (currentChild.content) {
                    innerHtml += currentChild.content;
                }

                innerHtml += '</' + currentChild.type + '>';
            }

            innerHtml += that.content;

            innerHtml += '</' + outerTag + '>';
            return innerHtml;
        }

        function getStringOfAttributes() {
            var that = this,
                result = '',
                attributesCount = that.attributes.length,
                sortedAttributes = sortArrayOfObjectsByKeyName(that.attributes),
                attributeName,
                attributeValue;

            for (var i = 0; i < attributesCount; i += 1) {
                attributeName = Object.keys(sortedAttributes[i])[0];
                attributeValue = sortedAttributes[i][attributeName];
                result += attributeName + '="' + attributeValue + '" ';
            }

            return result.trim();
        }

        return domElement;
    } ());
    return domElement;
}
//module.exports = solve;
