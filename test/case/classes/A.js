/**
 * Test class
 * @constructor
 * @ConstructorAnnotation(i=0, s="string", a={"0", "1"})
 */
function A() {

}

A.prototype = {

    /**
     * Test property
     * @type {String}
     * @PropertyAnnotation() @AnotherPropertyAnnotation("test inline")
     */
    a: null,

    /** @PropertyAnnotation() */
    b: true,

    /**
     * Test method
     * @MethodAnnotation()
     */
    c: function () {
        var a = {};
    }
};

/**
 * Test method
 * @MethodAnnotation()
 */
A.prototype.d = function () {

};

/**
 * Test method
 * @MethodAnnotation()
 * @AnotherMethodAnnotation(5)
 */
A.prototype.e = function () {

};

/**
 * Test external property
 * @type {boolean}
 * @PropertyAnnotation()
 */
A.prototype.f = true;

module.exports = A;