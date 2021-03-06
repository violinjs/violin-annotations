/**
 * String Tokenizer
 * @constructor
 * @memberOf {violin.annotations.reader.tokenizer}
 * @param {String} tokenizer
 */
var Tokenizer = function (str) {
    if (typeof str !== "string") {
        throw new Error("Tokenizer could only tokenize strings");
    }
    this.str = str;
    this.pos = 0;
    this.inString = false;
};

Tokenizer.prototype = {

    /**
     * String to tokenize
     * @type {String}
     */
    str: null,

    /**
     * Tokenizer position
     * @var {Number}
     */
    pos: 0,

    /**
     * Whether tokenizer is parsing a String
     */
    inString: false
};

Tokenizer.WHITE_SPACES = /\s/;

/**
 * Whether all tokens have been parsed
 * @returns {Boolean}
 */
Tokenizer.prototype.hasMoreTokens = function () {
    return this.str.length > this.pos;
};

/**
 * Get next token
 * @returns {String}
 */
Tokenizer.prototype.nextToken = function () {
    if (!this.hasMoreTokens()) {
        return "";
    }

    var token = "",
        backslashesCount = 0;
    for (var i = this.pos; i < this.str.length; i++) {
        var c = this.str[i];

        this.pos++;

        if (c === '\\') {
            backslashesCount++;
        } else {
            if (c === '"') {
                if (backslashesCount % 2 === 0) {
                    this.inString = !this.inString;
                }
            }
            backslashesCount = 0;
        }

        if (c.match(Tokenizer.WHITE_SPACES) && !this.inString) {
            break;
        }
        token += c;
    }

    if (this.inString) {
        throw new Error("An error occurred : Expected String end");
    }

    return token != "" ? token : this.nextToken();
};

module.exports = Tokenizer;