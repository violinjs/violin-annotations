# violin-annotations

Annotation parser for Node.js

## Installation

`npm install violin-annotations`

Will install the latest version of violin-annotations

## Example

```js
// ClassAnnotation.js

var util = require("util");

var Annotation = require("violin-annotations").Annotation,
    Target = require("violin-annotations").Target;

function ClassAnnotation(parameters) {
    Annotation.call(this, parameters);
}
util.inherits(ClassAnnotation, Annotation);

/**
 * Sample attribute
 */
ClassAnnotation.prototype.sample = "Hello world !";

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
        return "ClassAnnotation";
    };

module.exports = ClassAnnotation;
```

```js
// MyClass.js

/**
 * @ClassAnnotation(sample="Hello annotations")
 */
function MyClass() {

}

module.exports = MyClass;
```

```js
var Parser = require("violin-annotations"),
    parser = new Parser();

parser.getRegistry().registerAnnotationFile("ClassAnnotation.js");

parser.parseFile("MyClass.js", function (annotations) {
    console.log(annotations);
});
```