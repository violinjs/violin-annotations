var path = require("path"),
    util = require("util");

var Annotation = require(path.join(__dirname, "..", "..", "..", "src", "annotation", "Annotation.js")),
    Target = require(path.join(__dirname, "..", "..", "..", "src", "Target.js"));

function MethodAnnotation(parameters) {
    Annotation.call(this, parameters);
}

MethodAnnotation.prototype = {
    hello: "World"
};

MethodAnnotation.getTargets = function () {
    return [
        Target.METHOD_ANNOTATION
    ];
};


/**
 * @inheritDoc
 */
MethodAnnotation.getName =
    MethodAnnotation.prototype.getName = function () {
        return "MethodAnnotation";
    };

module.exports = MethodAnnotation;