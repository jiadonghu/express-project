
const Premissions = require('../utils/permissions');

module.exports = {

    /**
     * If permissions indicated a valid user 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      user_id        - user id
     * @returns {boolean}                 
     */
    IsUser : (permissons, user_id) => {
        return (
            (permissons.indexOf(Premissions.VALID_USER(user_id))) > -1 
        );
    },

    /**
     * If permissions indicated a visitor 
     *
     * @param   {array}    permissons     - array of user's permissions
     * @param   {int}      user_id        - user id
     * @returns {boolean}                 
     */
    IsVisitor : (permissons) => {
        return (
            (permissons.indexOf(Premissions.VISITOR(user_id))) > -1 
        );
    }

};