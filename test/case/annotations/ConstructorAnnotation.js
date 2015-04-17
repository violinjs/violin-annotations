var path = require("path"),
    util = require("util");

var Annotation = require(path.join(__dirname, "..", "..", "..", "src", "annotation", "Annotation.js")),
    Target = require(path.join(__dirname, "..", "..", "..", "src", "Target.js"));

function ConstructorAnnotation(parameters) {
    Annotation.call(this, parameters);

    console.log(this);
    console.log(parameters);
    console.log(this.__proto__);
}

ConstructorAnnotation.prototype = {

    a: "Hello",

    d: null,

    i: null,

    s: null,

    t: null
};


/**
 * @inheritDoc
 */
ConstructorAnnotation.getName = function () {
    return "ns.ConstructorAnnotation";
};

module.exports = ConstructorAnnotation;