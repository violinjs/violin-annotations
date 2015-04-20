var path = require("path"),
    util = require("util");

var Registry = require(path.join(__dirname, "Registry.js"));

/**
 * Annotation registry
 * @constructor
 */
function AutoloaderRegistry() {
    Registry.call(this);
}

util.inherits(AutoloaderRegistry, Registry);


/**
 * Register an annotation
 * @param {String} filename
 */
AutoloaderRegistry.prototype.registerAnnotationFile = function (filename) {
    throw new Error("Annotations are autoloaded");
};

/**
 * Get an annotation
 * @param {String} annotation
 */
AutoloaderRegistry.prototype.getAnnotation = function (annotation) {
    if (undefined === this.annotations[annotation]) {
        var Annotation = global,
            ns = annotation.split(".");
        for (var i = 0; i < ns.length; i++) {
            Annotation = Annotation[ns[i]];
        }

        if (typeof Annotation !== "function") {
            throw new Error("Impossible to load annotation \"" + annotation + "\"");
        }

        this.annotations[annotation] = Annotation;
    }
    return this.annotations[annotation];
};

module.exports = AutoloaderRegistry;