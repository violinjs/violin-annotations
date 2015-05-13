var assert = require("assert"),
    should = require("should"),
    path = require("path");

var Reader = require(path.join(ROOT, "src", "reader", "Es6Reader.js"));

const TEST_FILE = path.join(ROOT, "test-case", "testcase-es6", "classes", "A.js");

describe("reader.Es6Reader", function () {

    describe("#read()", function () {
        it('should return an array', function (done) {
            var reader = new Reader(TEST_FILE);
            reader.read(function (err, annotations) {
                (!err).should.be.true;
                annotations.should.be.an.Array;
                done();
            });
        });

        it("should read all annotations in a file", function (done) {
            var reader = new Reader(TEST_FILE);
            reader.read(function (err, annotations) {
                (!err).should.be.true;
                console.log(annotations);
                annotations.length.should.be.exactly(12);
                done();
            });
        });
    });
});