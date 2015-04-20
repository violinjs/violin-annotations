var path = require("path"),
    util = require("util");

var Annotation = require(path.join(ROOT, "src", "annotation", "Annotation.js")),
    Target = require(path.join(ROOT, "src", "Target.js"));

function MethodAnnotation(parameters) {
    Annotation.call(this, parameters);
}
util.inherits(MethodAnnotation, Annotation);

MethodAnnotation.prototype.hello = "World";

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