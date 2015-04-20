var path = require("path"),
    util = require("util");

var Annotation = violin.annotations.annotation.Annotation,
    Target = violin.annotations.Target;

function ClassAnnotation(parameters) {
    Annotation.call(this, parameters);
}
util.inherits(ClassAnnotation, Annotation);

ClassAnnotation.prototype.val = null;

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
        return null;
    };

module.exports = ClassAnnotation;