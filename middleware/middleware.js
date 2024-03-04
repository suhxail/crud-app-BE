const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const SECRET_KEY = config.SECRET_KEY;

const middleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Middleware authentication failed' });
        }
        else {
            console.log("Token", token)
        }

        try {
            const decodedToken = jwt.verify(token, SECRET_KEY);
            console.log( "decodedToken", decodedToken)
            req.userId = decodedToken.userId;
            console.log(req.userId)
            next();
        } catch (error) {
            console.error('Error verifying token', error);
            return res.status(401).json({ message: 'Authentication failed' })
        }
    }
}

module.exports = middleware;