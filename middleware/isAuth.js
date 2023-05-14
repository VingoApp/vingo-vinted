var jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const PUB_KEY = fs.readFileSync('id_rsa_pub.pem', 'utf8');
const PRIV_KEY = fs.readFileSync('id_rsa_priv.pem', 'utf8');


module.exports = function isAuth(req, res, next) {
    let token = req.body.headers['Authorization'];
    let jwt_token = token.split(' ')[1];
    console.log(jwt_token, process.env.JWT_SECRET)
    let verified = jwt.verify(jwt_token, process.env.JWT_SECRET/* PUB_KEY, { algorithms: ['RS256'] } */);
    
    if (verified) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}