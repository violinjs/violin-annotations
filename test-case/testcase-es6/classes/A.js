/**
 * @ClassAnnotation()
 * @AnotherClassAnnotation()
 */
class A {

    constructor() {

        /**
         * @PropertyAnnotation()
         */
        this.prop = null;

        /**
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
}

module.exports = A;