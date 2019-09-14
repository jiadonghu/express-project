

/**
 * Convert input to int or int array
 *
 * @param   {(string|int|string[]|int[])}   value          - value to be converted
 * @returns {(|int|int[])}          
 */
const to_int = (value) => {
    value = Array.isArray(value) ? value.map(item => parseInt(item)) : parseInt(value);
    return value;
};

/**
 * validate value if it is array of int
 *
 * @param   {*}        value          - value to be validated
 * @returns {bool}                 
 */
const int_array = (value) => {
    if (!Array.isArray(value)) {
        throw new Error('value should be array');
    }

    for (let item of value) {
        if (!Number.isInteger(item) && !/^-{0,1}\d+$/.test(item)) {      
            throw new Error('value should be array of int');
        }
    }
    
    return true;
};

/**
 * validate value if it is image link
 *
 * @param   {*}        value          - value to be validated
 * @returns {bool}                 
 */
const image_link = (value) => {
    if (!/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/i.test(value)) {
        throw new Error('not an image link');
    }
    return true;
};

module.exports = {
    CustomValidator : {
        int_array,
        image_link
    },
    CustomSanitizer : {
        to_int
    }
};