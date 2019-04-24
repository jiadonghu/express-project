const Express = require('express');
const RouterRegister = require('./utils/controller_register');
const Auth = require('./utils/auth');
const Config = require('./config');
const Jwt = require('jsonwebtoken');
const App = Express();
const Router = Express.Router();
const BodyParser = require('body-parser');

Router.use(BodyParser.urlencoded({ extended: false }));
Router.use(BodyParser.json());

Router.use((req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        req.token = [];
        console.log('no token in header');
        return next();
    }

    try {
        let decoded = Jwt.verify(token, Config.jwt.secret);
        req.token = decoded;
    } catch(e) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    next();
});


RouterRegister.register(Router);

App.use('/', Router);

App.listen(3000);