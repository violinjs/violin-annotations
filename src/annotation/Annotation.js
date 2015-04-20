var path = require("path");

var Target = require(path.join(__dirname, "..", "Target.js"))

/**
 * Abstract annotation
 * @constructor
 */
var Annotation = function (parameters) {
    for (var i in this.__proto__) {
        if (this.__proto__.hasOwnProperty(i)) {
            this[i] = this.__proto__[i];
        }
    }
};

/**
 * Get annotation targets
 * @returns {Target[]}
 */
Annotation.getTargets = function () {
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

/**
 * Get annotation name
 * @abstract
 * @returns {String}
 */
Annotation.prototype.getName = function () {

};


module.exports = Annotation;