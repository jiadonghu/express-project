const Express        = require('express');
const RouterRegister = require('./utils/controller_register');
const Config         = require('./config');
const ExpJwt         = require('express-jwt');
const App            = Express();
const BodyParser     = require('body-parser');

App.use(ExpJwt({ secret: Config.jwt.secret }).unless({ path: ['/login', '/register'] }));
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

RouterRegister.Register(App, 
  {
    'User' : require('./controllers/user')
  }
);

App.use(function (err, req, res, next) {

    // from express jwt
    if (err.status === 401) {
      return res.status(401).json({ message: 'invalid token' });
    }

    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    // Unexpected error
    throw err;
});

App.listen(Config.api.port);