var assert = require("assert"),
    should = require("should"),
    path = require("path");

var Registry = require(path.join(__dirname, "..", "..", "src", "registry", "Registry.js"));

var ANNOTATION_FILE = path.join(__dirname, "..", "testcase", "annotations", "ClassAnnotation.js"),
    ANNOTATION_NAME = "ns.ClassAnnotation";

var Annotation = require(ANNOTATION_FILE);

describe("registry.Registry", function () {

    describe("#registerAnnotationFile()", function () {
        var registry = new Registry();
        it("should take a file in argument", function () {
            (function () {
                registry.registerAnnotationFile(0);
            }).should.throw;

            (function () {
                registry.registerAnnotationFile("./unexisting.js");
            }).should.throw;
        });

        it("should throw an error if the same annotation is registered twice", function () {
            (function () {
                registry.registerAnnotationFile(ANNOTATION_FILE);
                registry.registerAnnotationFile(ANNOTATION_FILE);
            }).should.throw;
        });
    });

    describe("#getAnnotation()", function () {
        var registry = new Registry();
        registry.registerAnnotationFile(ANNOTATION_FILE);

        it("should throw an error if the annotation is not registered", function () {
            (function () {
                registry.getAnnotation("Unexisting");
            }).should.throw;
        });

        it("should return an annotation", function () {
            registry.getAnnotation(ANNOTATION_NAME).should.be.type("function");
            registry.getAnnotation(ANNOTATION_NAME).should.be.equal(Annotation);

        });
    });
});