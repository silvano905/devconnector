const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');



const requireAuth = (req, res, next) => {
    //from the cookies get the cookie called "jwt"
    const token = req.cookies.jwt;
    //check if token exists & is verified
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.id;
        next();
    }catch (err) {
        res.status(401).json({msg: "Token is not valid"})

    }

}


module.exports = requireAuth;