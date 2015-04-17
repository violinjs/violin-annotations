var path = require("path");

var Target = require(path.join(__dirname, "..", "Target.js"))

/**
 * Abstract annotation
 * @constructor
 */
var Annotation = function (parameters) {

};

/**
 * Get annotation targets
 * @returns {Target[]}
 */
Annotation.prototype.getTargets = function () {
    return [
        Target.CLASS_ANNOTATION,
        Target.METHOD_ANNOTATION,
        Target.PROPERTY_ANNOTATION
    ];
};

/**
 * Get annotation name
 * @abstract
 * @returns {String}
 */
Annotation.getName = function () {

};

module.exports = Annotation;