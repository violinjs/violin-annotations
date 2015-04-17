var path = require("path");

var Parser = require(path.join(__dirname, "..", "src", "Parser.js"));

var TEST_FILE = path.join(__dirname, "case", "classes", "A.js"),
    STR_ERROR_FILE = path.join(__dirname, "case", "classes", "B.js"),
    ARRAY_ERROR_FILE = path.join(__dirname, "case", "classes", "C.js");

describe("Parser", function () {

    describe("#contructor()", function () {

    });

    describe("#parseFile()", function () {
        it("should return an object asynchronously", function (done) {
            var parser = new Parser();
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
        })
    });
});