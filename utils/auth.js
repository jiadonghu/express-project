const premissions = require('./permissions');
const HttpError   = require('http-errors'); 

module.exports = {

    /**
     * If permissions indicated a valid user 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      userId         - user id
     * @returns {boolean}                 
     */
    isUser : (permissons, userId) => {

        if (
            Array.isArray(permissons) && 
            permissons.indexOf(premissions.VALID_USER(userId)) > -1 
        ) {
            return true;
        }
        
        throw new HttpError(401, 'Not Authorized');
    },

    /**
     * If permissions indicated a visitor 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      userId         - user id
     * @returns {boolean}                 
     */
    isVisitor : (permissons) => {

        if (
            Array.isArray(permissons) && 
            permissons.indexOf(premissions.VISITOR) > -1 
        ) {
            return true;
        }
        
        throw new HttpError(401, 'Not Authorized');
    }

};