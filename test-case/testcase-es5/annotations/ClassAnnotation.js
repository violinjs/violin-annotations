var path = require("path"),
    util = require("util");

var Annotation = require(path.join(ROOT, "src", "annotation", "Annotation.js")),
    Target = require(path.join(ROOT, "src", "Target.js"));

function ClassAnnotation(parameters) {
    Annotation.call(this, parameters);
}
util.inherits(ClassAnnotation, Annotation);

ClassAnnotation.prototype.a = "Hello";
ClassAnnotation.prototype.d = null;
ClassAnnotation.prototype.i = null;
ClassAnnotation.prototype.s = null;
ClassAnnotation.prototype.t = null;


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