var path = require("path"),
    util = require("util");

var Annotation = require(path.join(__dirname, "..", "..", "..", "src", "annotation", "Annotation.js")),
    Target = require(path.join(__dirname, "..", "..", "..", "src", "Target.js"));

function ClassAnnotation(parameters) {
    Annotation.call(this, parameters);
}

ClassAnnotation.prototype = {

    a: "Hello",

    d: null,

    i: null,

    s: null,

    t: null
};

ClassAnnotation.getTargets = function () {
    return [
        Target.CLASS_ANNOTATION
    ];
};

/**
 * @inheritDoc
 */
ClassAnnotation.getName =
    ClassAnnotation.prototype.getName = function () {
        return "ns.ClassAnnotation";
    };

module.exports = ClassAnnotation;