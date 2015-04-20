var assert = require("assert"),
    should = require("should"),
    path = require("path");

var Parser = require(path.join(__dirname, "..", "src", "Parser.js"));

var TEST_FILE = path.join(__dirname, "testcase", "classes", "A.js"),
    STR_ERROR_FILE = path.join(__dirname, "testcase", "classes", "B.js"),
    ARRAY_ERROR_FILE = path.join(__dirname, "testcase", "classes", "C.js");


var ANNOTATION_PATH = path.join(__dirname, "testcase", "annotations"),
    CLASS_ANNOTATION = path.join(ANNOTATION_PATH, "ClassAnnotation.js"),
    METHOD_ANNOTATION = path.join(ANNOTATION_PATH, "MethodAnnotation.js"),
    PROPERTY_ANNOTATION = path.join(ANNOTATION_PATH, "PropertyAnnotation.js");

describe("Parser", function () {

    describe("#parseFile()", function () {
        it("should return an error if annotation parsing encountered an error", function (done) {
            var parser = new Parser();
            parser.parseFile(STR_ERROR_FILE, function (err) {
                (!err).should.be.false;
                err.message.should.containEql("Expected String end");
                parser = new Parser();
                parser.parseFile(ARRAY_ERROR_FILE, function (err) {
                    (!err).should.be.false;
                    err.message.should.containEql("Expected Array end");
                    done();
                });
            });
        });


        var parser = new Parser();
        parser.getRegistry().registerAnnotationFile(CLASS_ANNOTATION);
        parser.getRegistry().registerAnnotationFile(METHOD_ANNOTATION);
        parser.getRegistry().registerAnnotationFile(PROPERTY_ANNOTATION);

        it("should return an object asynchronously", function (done) {
            parser.parseFile(TEST_FILE, function (err, annotations) {
                (!err).should.be.true;
                annotations.should.be.an.Object.and.not.an.Array;

                (undefined !== annotations.classAnnotations).should.be.true;
                annotations.classAnnotations.should.be.an.Array;

                (undefined !== annotations.methodsAnnotations).should.be.true;
                annotations.methodsAnnotations.should.be.an.Object.and.not.an.Array;

                (undefined !== annotations.propertiesAnnotations).should.be.true;
                annotations.propertiesAnnotations.should.be.an.Object.and.not.an.Array;
                done();
            });
        });

        it("should return registered annotations only", function (done) {
            parser.parseFile(TEST_FILE, function (err, annotations) {
                (!err).should.be.true;

                annotations.classAnnotations.length.should.be.exactly(1);
                annotations.methodsAnnotations.c.length.should.be.exactly(1);
                annotations.propertiesAnnotations.a.length.should.be.exactly(1);
                done();
            });
        });
    });

    describe("#parseClass()", function () {
        var B = function () {};
        var registry = new violin.annotations.registry.AutoloaderRegistry(),
            parser = new Parser(registry);

        it("should return throw an error if class cannot be loaded", function () {
            (function () {
                parser.parseClass(B, function () {

                });
            }).should.throw;
        });

        it("should return an object asynchronously", function (done) {
            parser.parseClass(tests.tests.A, function (err, annotations) {
                (!err).should.be.true;
                annotations.classAnnotations.length.should.be.exactly(1);
                done()
            });
        });
    });
});