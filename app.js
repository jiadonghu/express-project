const express        = require('express');
const app            = express();
const routerRegister = require('./utils/controller_register');
const config         = require('./config');
const bodyParser     = require('body-parser');
const token          = require('./utils/token');
const cors           = require('cors');

app.use(cors());
app.use(token.decode);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routerRegister.register(app, 
  {
    'user' : require('./controllers/user'),
    'post' : require('./controllers/post'),
    'tag'  : require('./controllers/tag')
  }
);

// handle error and response
app.use(function (err, req, res, next) {

    if (err.statusCode) {
      return res.status(err.statusCode).json(err.message);
    }
    
    console.log(err.message);
    // Unexpected error
    throw err;
});

app.listen(config.api.port);