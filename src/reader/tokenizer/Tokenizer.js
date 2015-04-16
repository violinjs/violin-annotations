/**
 * String Tokenizer
 * @constructor
 * @param {String} tokenizer
 */
var Tokenizer = function (str) {
    if (typeof str !== "string") {
        throw new Error("Tokenizer could only tokenize strings");
    }
    this.str = str;
    this.pos = 0;
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
    pos: 0
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

    var token = "";
    for (var i = this.pos; i < this.str.length; i++) {
        this.pos++;

        if (this.str[i].match(Tokenizer.WHITE_SPACES)) {
            break;
        }
        token += this.str[i];
    }

    return token != "" ? token : this.nextToken();
};

module.exports = Tokenizer;