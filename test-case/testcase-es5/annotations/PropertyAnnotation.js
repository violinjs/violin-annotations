var path = require("path"),
    util = require("util");

var Annotation = require(path.join(ROOT, "src", "annotation", "Annotation.js")),
    Target = require(path.join(ROOT, "src", "Target.js"));

function PropertyAnnotation(parameters) {
    Annotation.call(this, parameters);
}
util.inherits(PropertyAnnotation, Annotation);

PropertyAnnotation.prototype.prop = true;

PropertyAnnotation.getTargets = function () {
    return [
        Target.PROPERTY_ANNOTATION
    ];
};


/**
 * @inheritDoc
 */
PropertyAnnotation.getName =
    PropertyAnnotation.prototype.getName = function () {
        return "PropertyAnnotation";
    };

module.exports = PropertyAnnotation;