const Express        = require('express');
const RouterRegister = require('./utils/controller_register');
const Config         = require('./config');
const App            = Express();
const BodyParser     = require('body-parser');
const Token          = require('./utils/token');
const Cors           = require('cors');

App.use(Cors());
App.use(Token.Decode);
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

RouterRegister.Register(App, 
  {
    'User' : require('./controllers/user'),
    'Post' : require('./controllers/post')
  }
);

App.use(function (err, req, res, next) {

    if (err.statusCode) {
      return res.status(err.statusCode).json(err.message);
    }
    
    // Unexpected error
    throw err;
});

App.listen(Config.api.port);