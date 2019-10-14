// set env param as test 
process.env.NODE_ENV = 'test';

const { customValidator, customSanitizer} = require('../../utils/custom_validator');
const should = require('should');

describe('Custom Validator', () => {

    it('customValidator.intArray should throw error when value is not array', () => {

        let testCases = [
            'test',
            2,
            false,
            { a: 1 }
        ];

        for (let testCase of testCases ) {
            try {
                customValidator.intArray(testCase);
                throw new Error('shold throw error here');
            } catch(e) {
                e.message.should.equal('value should be array');
            }    
        }    

    });

    it('customValidator.intArray should throw error when value is not int array', () => {

        let testCases = [
            [ '1', '2rt' ],
            [ false, true ],
            [{ a: 1 }, { b: 2 }]
        ];

        for (let testCase of testCases ) {
            try {
                customValidator.intArray(testCase);
                throw new Error('shold throw error here'); 
            } catch(e) {
                e.message.should.equal('value should be array of int');
            }    
        }    

    });

    it('customValidator.intArray pass when value is int array', () => {

        let testCases = [
            [ '1', '2' ],
            [ 3, 4 ]
        ];

        for (let testCase of testCases ) {
            customValidator.intArray(testCase);
        }    

    });

    it('customValidator.imageLink should throw error when value is not image link', () => {

        let testCases = [
            2,
            false,
            { a: 1 },
            undefined,
            'https://www.google.com/',
            'https://www.image.org',
            'not link'
        ];

        for (let testCase of testCases ) {
            try {
                customValidator.imageLink(testCase);
                throw new Error('shold throw error here');
            } catch(e) {
                e.message.should.equal('not an image link');
            }    
        }    

    });

    it('customValidator.imageLink should pass when value is image link', () => {

        let testCases = [
            'https://www.image.org/123.jpg',
            'http://image.png',
            'http://image.gif',
            'https://www.image.org/123.svg'
        ];

        for (let testCase of testCases ) {
            customValidator.imageLink(testCase);
        }    

    });

    it('customSanitizer.toInt should convert value to int or int array', () => {

        let testCases = [
           {
               input  : ['12', '23'],
               output : [12, 23]
           },
           {
               input  : '23',
               output : 23
           }
        ];

        for (let testCase of testCases ) {
            customSanitizer.toInt(testCase.input).should.eql(testCase.output);
        }    

    });
});