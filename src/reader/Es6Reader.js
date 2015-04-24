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
function Es6Reader(filename) {
    this.filename = filename
    this.state = Es6Reader.State.READING;
}

Es6Reader.prototype = {

    /**
     * File to parse
     * @type {String}
     */
    filename: null,

    /**
     * Parsing state
     * @type {Es6Reader.State}
     */
    state: null,

    /**
     * Word tokenizer
     * @type {violin.annotations.reader.tokenizer.Tokenizer}
     */
    tokenizer: null
};

/**
 * Es6Reader state
 * @enum {Es6Reader.State}
 */
Es6Reader.State = {
    READING: 0,
    IN_COMMENT: 1,
    IN_ANNOTATION: 2,
    IN_TARGET: 3
};

Es6Reader.ID = "[a-z0-9_]+";

Es6Reader.FUNC = "^function";
Es6Reader.FUNC_REGEX = new RegExp(Es6Reader.FUNC, "i")

Es6Reader.CLASS_PATTERN = "class(" + Es6Reader.ID + ")\\{";
Es6Reader.CLASS_REGEX = new RegExp(Es6Reader.CLASS_PATTERN, "i");

Es6Reader.PROTO_PATTERN = "^this\.(" + Es6Reader.ID + ")=(.+)";
Es6Reader.PROTO_REGEX = new RegExp(Es6Reader.PROTO_PATTERN, "i");

Es6Reader.DEF_PATTERN = "^(" + Es6Reader.ID + ")\\(";
Es6Reader.DEF_REGEX = new RegExp(Es6Reader.DEF_PATTERN, "i");

/**
 * Read file
 * @param callback Annotations
 * @public
 */
Es6Reader.prototype.read = function (callback) {
    var self = this;
    fs.stat(self.filename, function (err, stats) {
        if (err) {
            return callback(err);
        }

        if (!stats.isFile()) {
            return callback("Es6Reader cannot read errors from a directory");
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
Es6Reader.prototype.parse = function (callback) {
    var token = "",
        target = "",
        annotation = "",
        block = [],
        annotations = [];

    try {
        while (this.tokenizer.hasMoreTokens()) {
            token = this.tokenizer.nextToken();
            if (this.state === Es6Reader.State.READING) {
                if (token === "/**") {
                    this.state = Es6Reader.State.IN_COMMENT;
                    block = [];
                }
                continue;
            }

            // Parse annotations
            if (this.state === Es6Reader.State.IN_ANNOTATION) {
                if (token[0] === "@" || token === "*" || token === "*/") {
                    annotation = "";
                    this.state = Es6Reader.State.IN_COMMENT;
                } else {
                    annotation += token;
                    if (annotation.substr(-1) === ")") {
                        if (-1 < annotation.indexOf("(")) {
                            block.push(annotation.substring(1));
                        }
                        this.state = Es6Reader.State.IN_COMMENT;
                        continue;
                    }
                }
            }

            // Parse comments
            if (this.state === Es6Reader.State.IN_COMMENT) {
                if (token === "*/") {
                    this.state = Es6Reader.State.IN_TARGET;
                    continue;
                }

                if (token[0] === "@") {
                    if (token.substr(-1) === ")") {
                        block.push(token.substring(1));
                        continue;
                    }
                    annotation = token;
                    this.state = Es6Reader.State.IN_ANNOTATION;
                }
                continue;
            }

            // Parse annotation target
            if (this.state === Es6Reader.State.IN_TARGET) {

                if (block.length === 0) {
                    this.state = Es6Reader.State.READING;
                    continue;
                }

                var found = false,
                    matches;
                target += token;

                if (matches = target.match(Es6Reader.CLASS_REGEX)) {
                    annotations.push({
                        type: Target.CLASS_ANNOTATION,
                        target: matches[1],
                        annotations: block
                    });
                    found = true;
                }

                if (matches = target.match(Es6Reader.PROTO_REGEX)) {
                    annotations.push(this.parsePrototype(matches, block));
                    found = true;
                }

                if (matches = target.match(Es6Reader.DEF_REGEX)) {
                    annotations.push(this.parsePrototype(matches, block));
                    found = true;
                }

                if (found) {
                    target = "";
                    this.state = Es6Reader.State.READING;
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
Es6Reader.prototype.parsePrototype = function (matches, block) {
    if (!matches[2]) {
        return {
            type: Target.METHOD_ANNOTATION,
            target: matches[1],
            annotations: block
        };
    }

    if (matches[2].match(Es6Reader.FUNC_REGEX)) {
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

module.exports = Es6Reader;