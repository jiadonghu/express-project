const Validations      = require('./validation');
const { validationResult } = require('express-validator');

module.exports = {
    
    /**
     * Register controllers and validate middlewares to express
     *
     * @param   {obj}      app            - express instance
     * @param   {obj}      controllers    - controllers to be registered
     * @returns {null}                 
     */
    Register : (app, controllers) => {

        //  handle rejected promises
        let wrap_async = (fn) => {
            return (req, res, next) => {
                fn(req, res, next).catch(next);
            };
        };

        // recieve validate error before process to controller function
        let validate_params = (req, res, next) => {
        
            let errors = validationResult(req);
           
            if (!errors.isEmpty()) {
                let messages = errors.array().map(err_obj => {
                    return `${err_obj.msg}: ${err_obj.param}`;
                })
                return res.status(400).json(messages);
            }

            next();
        };

        for (let con_name in controllers) {

            for (let route of controllers[con_name].routes) {

                let val_funcs = [];
                if (Validations[con_name] && Validations[con_name][route.function]) {
                    val_funcs = Validations[con_name][route.function]
                }

                // register routes
                app[route.method](
                    route.route, 
                    val_funcs || [], 
                    validate_params,
                    wrap_async(controllers[con_name][route.function])
                );

            }

        }
        
     }

};