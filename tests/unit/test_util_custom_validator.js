// set env param as test 
process.env.NODE_ENV = 'test';

const { CustomValidator, CustomSanitizer} = require('../../utils/custom_validator');
const Should = require('should');

describe('Custom Validator', () => {

    it('CustomValidator.int_array should throw error when value is not array', () => {

        let test_cases = [
            'test',
            2,
            false,
            { a: 1 }
        ];

        for (let test_case of test_cases ) {
            try {
                CustomValidator.int_array(test_case);
                throw new Error('shold throw error here');
            } catch(e) {
                e.message.should.equal('value should be array');
            }    
        }    

    });

    it('CustomValidator.int_array should throw error when value is not int array', () => {

        let test_cases = [
            [ '1', '2rt' ],
            [ false, true ],
            [{ a: 1 }, { b: 2 }]
        ];

        for (let test_case of test_cases ) {
            try {
                CustomValidator.int_array(test_case);
                throw new Error('shold throw error here'); 
            } catch(e) {
                e.message.should.equal('value should be array of int');
            }    
        }    

    });

    it('CustomValidator.int_array pass when value is int array', () => {

        let test_cases = [
            [ '1', '2' ],
            [ 3, 4 ]
        ];

        for (let test_case of test_cases ) {
            CustomValidator.int_array(test_case);
        }    

    });

    it('CustomValidator.image_link should throw error when value is not image link', () => {

        let test_cases = [
            2,
            false,
            { a: 1 },
            undefined,
            'https://www.google.com/',
            'https://www.image.org',
            'not link'
        ];

        for (let test_case of test_cases ) {
            try {
                CustomValidator.image_link(test_case);
                throw new Error('shold throw error here');
            } catch(e) {
                e.message.should.equal('not an image link');
            }    
        }    

    });

    it('CustomValidator.image_link should pass when value is image link', () => {

        let test_cases = [
            'https://www.image.org/123.jpg',
            'http://image.png',
            'http://image.gif',
            'https://www.image.org/123.svg'
        ];

        for (let test_case of test_cases ) {
            CustomValidator.image_link(test_case);
        }    

    });

    it('CustomSanitizer.to_int should convert value to int or int array', () => {

        let test_cases = [
           {
               input  : ['12', '23'],
               output : [12, 23]
           },
           {
               input  : '23',
               output : 23
           }
        ];

        for (let test_case of test_cases ) {
            CustomSanitizer.to_int(test_case.input).should.eql(test_case.output);
        }    

    });
});