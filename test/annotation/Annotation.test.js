var assert = require("assert"),
    should = require("should"),
    path = require("path");

var Annotation = require(path.join(__dirname, "..", "..", "src", "annotation", "Annotation.js"));


describe("annotation.Annotation", function () {
    describe("#getTarget()", function () {
        it("should return an Array", function () {
            Annotation.getTargets().should.be.an.Array;
        });
    });

    describe("#getName()", function () {

        it("should be an abstract method", function () {
            (Annotation.getName() === undefined).should.be.true;
        });
    });
});