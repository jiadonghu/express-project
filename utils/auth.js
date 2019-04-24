const Jwt = require('jsonwebtoken');

module.exports = {
    Token : (req, res, next) => {
        
        ValidateToken : (req, res, next) => {
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
        }
    }
};