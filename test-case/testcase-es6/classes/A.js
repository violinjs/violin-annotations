/**
 * @ClassAnnotation()
 * @AnotherClassAnnotation()
 */
class A {

    /**
     * @public
     * @ConstructorAnnotations()
     */
    constructor() {

        /**
         * @private
         * @PropertyAnnotation()
         */
        this.prop = null;

        /**
         * @private
         * @PropertyAnnotation()
         */
        this.prop2 = null;

        /**
         * @MethodAnnotation()
         */
        this.method2 = function () {

        };
    }

    /**
     * @MethodAnnotation(a=4, b={})
     * @AnotherMethodAnnotation()
     */
    method() {

    }

    /**
     * @AnotherMethodAnnotation()
     */
    method1(a = 5, ...b) {

    }
}

module.exports = A;