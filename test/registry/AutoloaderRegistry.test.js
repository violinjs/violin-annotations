var assert = require("assert"),
    should = require("should"),
    path = require("path");

var ANNOTATION_NAME = "tests.annotations.ClassAnnotation";


var AutoloaderRegistry = violin.annotations.registry.AutoloaderRegistry;

describe("registry.AutoloaderRegistry", function () {

    describe("#registerAnnotationFile()", function () {
        var registry = new AutoloaderRegistry();
        it("should throw an error whether file exists or not", function () {
            (function () {
                registry.registerAnnotationFile(ANNOTATION_FILE);
            }).should.throw;
        });
    });

    describe("#getAnnotation()", function () {
        var registry = new AutoloaderRegistry();

        it("should throw an error if the annotation is not registered", function () {
            (function () {
                registry.getAnnotation("tests.annotations.Unexisting");
            }).should.throw;
        });

        it("should return an annotation", function () {
            registry.getAnnotation(ANNOTATION_NAME).should.be.type("function");
            registry.getAnnotation(ANNOTATION_NAME).should.be.equal(tests.annotations.ClassAnnotation);
        });
    });
});