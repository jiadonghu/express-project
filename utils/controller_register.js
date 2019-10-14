const validations      = require('./validation');
const { validationResult } = require('express-validator');

module.exports = {
    
    /**
     * Register controllers and validate middlewares to express
     *
     * @param   {obj}      app            - express instance
     * @param   {obj}      controllers    - controllers to be registered
     * @returns {null}                 
     */
    register : (app, controllers) => {

        //  handle rejected promises
        let wrapAsync = (fn) => {
            return (req, res, next) => {
                fn(req, res, next).catch(next);
            };
        };

        // recieve validate error before process to controller function
        let validateParams = (req, res, next) => {
        
            let errors = validationResult(req);
           
            if (!errors.isEmpty()) {
                let messages = errors.array().map(errObj => {
                    return `${errObj.msg}: ${errObj.param}`;
                });
                return res.status(400).json(messages);
            }

            next();
        };

        for (let conName in controllers) {

            for (let route of controllers[conName].routes) {

                let valFuncs = [];
                if (validations[conName] && validations[conName][route.function]) {
                    valFuncs = validations[conName][route.function]
                }

                // register routes
                app[route.method](
                    route.route, 
                    valFuncs || [], 
                    validateParams,
                    wrapAsync(controllers[conName][route.function])
                );

            }

        }
        
     }

};