var assert = require("assert"),
    should = require("should"),
    fs = require("fs");

/**
 * Annotation registry
 * @constructor
 */
function Registry() {
    this.annotations = [];
}

Registry.prototype = {

    /**
     * Registered annotations
     * @type {Array}
     */
    annotations: []
};

/**
 * Register an annotation
 * @param {String} filename
 */
Registry.prototype.registerAnnotationFile = function (filename) {
    if (typeof filename !== "string") {
        throw new Error("Filename must be a String");
    }

    var stats = fs.statSync(filename);
    if (!stats.isFile()) {
        throw new Error("File does not exist");
    }
    var Annotation = require(filename);
    if (this.annotations[Annotation.getName()]) {
        throw new Error("Annotation \"" + Annotation.getName() + "\" is already defined");
    }
    this.annotations[Annotation.getName()] = Annotation;
};

/**
 * Get an annotation
 * @param {String} annotation
 */
Registry.prototype.getAnnotation = function (annotation) {
    if (undefined === this.annotations[annotation]) {
        throw new Error("Unexisting annotation \"" + annotation + "\".");
    }
    return this.annotations[annotation];
};

module.exports = Registry;