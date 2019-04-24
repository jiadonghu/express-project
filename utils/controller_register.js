const Validations = require('./validation');

const _controllers = {
    User : require('../controllers/user')
};


module.exports = {
    
    register : (app) => {

        for (let con_name in _controllers) {

            for (let route of _controllers[con_name].routes) {

                let val_funcs = [];
                if (Validations[con_name] && Validations[con_name][route.function]) {
                    val_funcs = Validations[con_name][route.function]
                }

                // register routes
                app[route.method](
                    route.route, 
                    val_funcs || [], 
                    _controllers[con_name][route.function]
                );

            }

        }
        
     }

};