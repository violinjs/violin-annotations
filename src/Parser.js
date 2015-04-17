var path = require("path"),
    async = require("async");

var Es5Reader = require(path.join(__dirname, "reader", "Es5Reader.js")),
    Registry = require(path.join(__dirname, "registry", "Registry.js"))
Target = require(path.join(__dirname, "Target.js"));


/**
 * This class represents an annotation parser
 * @constructor
 * @memberOf {violin.annotations}
 * @param {violin.annotations.registry.Registry} registry Annotation registry
 * @param {Function} Reader File reader
 */
function Parser(registry, Reader) {
    if (!Reader) {
        Reader = Es5Reader;
    }

    if (!registry) {
        registry = new Registry();
    }

    this.registry = registry
    this.Reader = Reader;
    this.cache = {};
}

Parser.prototype = {

    /**
     * File reader
     * @var {Reader}
     */
    Reader: null,

    /**
     * Annotation registry
     * @type {violin.annotations.registry.Registry}
     */
    registry: null,

    /**
     * Annotations cache
     */
    cache: {}
};

/**
 *
 * @enum {Parser.state}
 */
Parser.State = {
    NAME: 0,
    PARAMETERS: 1,
    ARRAY: 2
};

/**
 * Get registry
 * @returns {violin.annotations.registry.Registry}
 */
Parser.prototype.getRegistry = function () {
    return this.registry;
};

/**
 * Parse a file
 * @param {String} filename
 * @param {Function} callback
 * @public
 */
Parser.prototype.parseFile = function (filename, callback) {
    if (undefined !== this.cache[filename]) {
        return callback(null, this.cache[filename]);
    }

    var self = this;
    if (typeof filename !== "string") {
        throw new Error("Filename should be a String");
    }
    if (typeof callback !== "function") {
        throw new Error("Callback should be a Function");
    }

    var reader = new self.Reader(filename);
    reader.read(function (err, annotations) {
        if (err) {
            return callback(err);
        }

        var formattedAnnotations = {};
        formattedAnnotations.classAnnotations = [];
        formattedAnnotations.methodsAnnotations = {};
        formattedAnnotations.propertiesAnnotations = {};

        async.each(annotations, function (annotation, cb) {
            try {
                switch (annotation.type) {

                    // Parse class annotations
                    case Target.CLASS_ANNOTATION:
                        formattedAnnotations.classAnnotations =
                            formattedAnnotations.classAnnotations.concat(
                                self.parseAnnotations(annotation.annotations)
                            );
                        break;
                    case Target.METHOD_ANNOTATION:
                        if (undefined === formattedAnnotations.methodsAnnotations[annotation.target]) {
                            formattedAnnotations.methodsAnnotations[annotation.target] = [];
                        }
                        formattedAnnotations.methodsAnnotations[annotation.target] =
                            formattedAnnotations.methodsAnnotations[annotation.target].concat(
                                self.parseAnnotations(annotation.annotations)
                            );
                        break;

                    case Target.PROPERTY_ANNOTATION:
                        if (undefined === formattedAnnotations.propertiesAnnotations[annotation.target]) {
                            formattedAnnotations.propertiesAnnotations[annotation.target] = [];
                        }

                        formattedAnnotations.propertiesAnnotations[annotation.target] =
                            formattedAnnotations.propertiesAnnotations[annotation.target].concat(
                                self.parseAnnotations(annotation.annotations)
                            );
                        break;
                }
            } catch (err) {
                cb(err);
            }
            cb();
        }, function (err) {
            if (!err) {
                self.cache[filename] = formattedAnnotations;
            }
            callback(err, formattedAnnotations);
        });
    });
};


/**
 * Parse an annotation
 * @param {String} annotation Annotation to parse
 */
Parser.prototype.parseAnnotation = function (annotation) {
    var state = Parser.State.NAME,
        parsedAnnotation = {
            className: "",
            parameters: [],
            namedParameters: {}
        };

    var className = "",
        parameter = "",
        parameters = [],
        p;

    var inString = false;

    for (var i = 0; i < annotation.length; i++) {
        var c = annotation[i];

        if (state === Parser.State.NAME) {
            if (c === '(') {
                parsedAnnotation.className = className;
                state = Parser.State.PARAMETERS;
                continue;
            }
            className += c;
            continue;
        }

        if (state === Parser.State.PARAMETERS) {
            if (this.toggleString(c, annotation[i - 1])) {
                inString = !inString;
            }

            if (c === '{' && !inString) {
                var t = [i + 1],
                    arr = this.parseArrayParameter(annotation, t),
                    param = {
                        key: null,
                        value: arr
                    };
                if (parameter !== "") {
                    param.key = parameter.substr(0, parameter.length - 1);
                    parameters.push(param);
                    parameter = "";
                }
                i = t[0];
                continue;
            }

            if (c === ',' || c === ')') {
                if (parameter !== "") {
                    parameters.push(this.parseParameter(parameter));
                    parameter = "";
                }
                continue;
            }
            parameter += c;
        }
    }

    if (inString) {
        throw new Error("An error occurred : Expected String end in \"" + annotation + "\"");
    }

    for (var i in parameters) {
        if (null == parameters[i].key) {
            parsedAnnotation.parameters.push(parameters[i].value);
            continue;
        }
        parsedAnnotation.namedParameters[parameters[i].key] = parameters[i].value;
    }

    return parsedAnnotation;
};

/**
 *
 * @param annotation Annotation to parse
 * @param {Array} pos Array containing current index
 * @returns {Object}
 */
Parser.prototype.parseArrayParameter = function (annotation, pos) {
    var end = false,
        parameter = "",
        arr = [],
        inString = false;

    for (; pos[0] < annotation.length; pos[0]++) {
        var i = pos[0],
            c = annotation[i];

        if (this.toggleString(c, annotation[i - 1])) {
            inString = !inString;
        }

        // Beginning of a nested array
        if (c === '{' && !inString) {
            var t = [pos[0] + 1];
            var a = this.parseArrayParameter(annotation, t);
            arr.push(a);
            pos[0] = t[0];
            continue;
        }

        // Array separator
        if (c === ',') {
            if (parameter !== "") {
                arr.push(this.parseParameter(parameter).value);
                parameter = "";
            }
            continue;
        }

        // End of array
        if (annotation[i] === '}' && !inString) {
            end = true;
            if (parameter !== "") {
                arr.push(this.parseParameter(parameter).value);
            }
            break;
        }
        parameter += c;
    }

    if (!end) {
        throw new Error("An error occurred : Expected Array end in \"" + annotation + "\"");
    }
    return arr;
};

/**
 * Parse a parameter
 * @param parameter Parameter to parse
 * @returns {Object}
 */
Parser.prototype.parseParameter = function (parameter) {
    var inValue = false,
        inString = false;

    var key = "",
        value;

    for (var i in parameter) {
        var c = parameter[i];
        if (c === '\\') {
            if (parameter[parseInt(i) + 1] === '"') {
                continue;
            }
        }

        if (this.toggleString(c, parameter[i - 1])) {
            inString = !inString;
            continue;
        }

        if (c === '=' && !inString) {
            value = "";
            inValue = true;
            continue;
        }

        if (inValue) {
            value += c;
        } else {
            key += c;
        }
    }

    if (undefined === value) {
        value = key;
        key = null;
    }

    var val;
    if (!isNaN(val = parseFloat(value))) {
        value = val;
    }
    return {
        key: key,
        value: value
    }
};

/**
 * Whether we should toggle inString status
 * @param current
 * @param previous
 * @returns {boolean}
 */
Parser.prototype.toggleString = function (current, previous) {
    return current === '"' && previous !== '\\';
};

/**
 * Parse annotations
 * @param annotations
 * @private
 */
Parser.prototype.parseAnnotations = function (annotations) {
    var parsedAnnotations = [];
    for (var i in annotations) {
        var parsedAnnotation = this.parseAnnotation(annotations[i]);
        parsedAnnotations.push(parsedAnnotation);
    }
    return parsedAnnotations;
};

module.exports = Parser;