const Express        = require('express');
const RouterRegister = require('./utils/controller_register');
const Config         = require('./config');
const ExpJwt         = require('express-jwt');
const App            = Express();
const BodyParser     = require('body-parser');
const Router         = Express.Router();

App.use(ExpJwt({ secret: Config.jwt.secret}).unless({path: ['/login', '/register']}));
Router.use(BodyParser.urlencoded({ extended: false }));
Router.use(BodyParser.json());

RouterRegister.Register(Router, 
  {
    'User' : require('./controllers/user')
  }
);

App.use('/', Router);
App.use(function (err, req, res, next) {

    // from express jwt
    if (err.code === 'invalid_token') {
      return res.status(401).json('invalid token');
    }

    if (err.statusCode) {
      return res.status(err.statusCode).json(err.message);
    }

    // Unexpected error
    throw err;
});

App.listen(3000);