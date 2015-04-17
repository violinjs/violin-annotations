var fs = require("fs"),
    path = require("path");

var Tokenizer = require(path.join(__dirname, "tokenizer", "Tokenizer.js")),
    Target = require(path.join(__dirname, "..", "Target.js"));

/**
 *
 * @param filename
 * @constructor
 * @memberOf {violin.annotations.reader}
 */
function Es5Reader(filename) {
    this.filename = filename
    this.state = Es5Reader.State.READING;
}

Es5Reader.prototype = {

    /**
     * File to parse
     * @type {String}
     */
    filename: null,

    /**
     * Parsing state
     * @type {Es5Reader.State}
     */
    state: null,

    /**
     * Word tokenizer
     * @type {violin.annotations.reader.tokenizer.Tokenizer}
     */
    tokenizer: null
};

/**
 * Es5Reader state
 * @enum {Es5Reader.State}
 */
Es5Reader.State = {
    READING: 0,
    IN_COMMENT: 1,
    IN_ANNOTATION: 2,
    IN_TARGET: 3
};

Es5Reader.ID = "[a-z0-9_]+";

Es5Reader.FUNC = "^function";
Es5Reader.FUNC_REGEX = new RegExp(Es5Reader.FUNC, "i")

Es5Reader.CLASS_PATTERN = Es5Reader.FUNC + "(" + Es5Reader.ID + ")\\(";
Es5Reader.CLASS_REGEX = new RegExp(Es5Reader.CLASS_PATTERN, "i");

Es5Reader.PROTO_PATTERN = "^(" + Es5Reader.ID + "):(.+)";
Es5Reader.PROTO_REGEX = new RegExp(Es5Reader.PROTO_PATTERN, "i");

Es5Reader.DEF_PATTERN = "^" + Es5Reader.ID + "\.prototype\.(" + Es5Reader.ID + ")=(.+)";
Es5Reader.DEF_REGEX = new RegExp(Es5Reader.DEF_PATTERN, "i");

/**
 * Read file
 * @param filename File to read
 * @param callback Annotations
 * @public
 */
Es5Reader.prototype.read = function (callback) {
    var self = this;
    fs.stat(self.filename, function (err, stats) {
        if (err) {
            return callback(err);
        }

        if (!stats.isFile()) {
            return callback("Es5Reader cannot read errors from a directory");
        }

        fs.readFile(self.filename, function (err, content) {
            if (err) {
                return callback(err);
            }

            self.tokenizer = new Tokenizer(content.toString());
            self.parse(callback);
        });
    });
};


/**
 * Parse file
 * @param callback
 * @private
 */
Es5Reader.prototype.parse = function (callback) {
    var token = "",
        target = "",
        annotation = "",
        block = [],
        annotations = [];

    try {
        while (this.tokenizer.hasMoreTokens()) {
            token = this.tokenizer.nextToken();

            if (this.state === Es5Reader.State.READING) {
                if (token === "/**") {
                    this.state = Es5Reader.State.IN_COMMENT;
                    block = [];
                }
                continue;
            }

            // Parse annotations
            if (this.state === Es5Reader.State.IN_ANNOTATION) {
                if (token[0] === "@" || token === "*") {
                    annotation = "";
                    this.state = Es5Reader.State.IN_COMMENT;
                } else {
                    annotation += token;
                    if (annotation.substr(-1) === ")") {
                        if (-1 < annotation.indexOf("(")) {
                            block.push(annotation.substring(1));
                        }
                        this.state = Es5Reader.State.IN_COMMENT;
                        continue;
                    }
                }
            }

            // Parse comments
            if (this.state === Es5Reader.State.IN_COMMENT) {
                if (token === "*/") {
                    this.state = Es5Reader.State.IN_TARGET;
                    continue;
                }

                if (token[0] === "@") {
                    if (token.substr(-1) === ")") {
                        block.push(token.substring(1));
                        continue;
                    }
                    annotation = token;
                    this.state = Es5Reader.State.IN_ANNOTATION;
                }
                continue;
            }

            // Parse annotation target
            if (this.state === Es5Reader.State.IN_TARGET) {
                var found = false,
                    matches;
                target += token;

                if (matches = target.match(Es5Reader.CLASS_REGEX)) {
                    annotations.push({
                        type: Target.CLASS_ANNOTATION,
                        target: matches[1],
                        annotations: block
                    });
                    found = true;
                }

                if (matches = target.match(Es5Reader.PROTO_REGEX)) {
                    annotations.push(this.parsePrototype(matches, block));
                    found = true;
                }

                if (matches = target.match(Es5Reader.DEF_REGEX)) {
                    annotations.push(this.parsePrototype(matches, block));
                    found = true;
                }

                if (found) {
                    target = "";
                    this.state = Es5Reader.State.READING;
                }
            }
        }

        callback(undefined, annotations);
    } catch (err) {
        return callback(err);
    }
};

/**
 * Parse prototype definition
 * @param matches
 * @returns {Object}
 * @private
 */
Es5Reader.prototype.parsePrototype = function (matches, block) {
    if (matches[2].match(Es5Reader.FUNC_REGEX)) {
        return {
            type: Target.METHOD_ANNOTATION,
            target: matches[1],
            annotations: block
        };
    }
    return {
        type: Target.PROPERTY_ANNOTATION,
        target: matches[1],
        annotations: block
    };
};

module.exports = Es5Reader;