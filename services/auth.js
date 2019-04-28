
const Premissions = require('../utils/permissions');
const HttpError   = require('http-errors'); 

module.exports = {

    /**
     * If permissions indicated a valid user 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      user_id        - user id
     * @returns {boolean}                 
     */
    IsUser : (permissons, user_id) => {

        if (
            Array.isArray(permissons) && 
            permissons.indexOf(Premissions.VALID_USER(user_id)) > -1 
        ) {
            return true;
        }
        
        throw new HttpError(401, 'Not Authorized');
    },

    /**
     * If permissions indicated a visitor 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      user_id        - user id
     * @returns {boolean}                 
     */
    IsVisitor : (permissons) => {

        if (
            Array.isArray(permissons) && 
            permissons.indexOf(Premissions.VISITOR(user_id)) > -1 
        ) {
            return true;
        }
        
        throw new HttpError(401, 'Not Authorized');
    }

};