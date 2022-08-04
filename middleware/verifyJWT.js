const jwt = require('jsonwebtoken') 
const constants = require('../config/constants')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader) return res.sendStatus(401) //startsWith('Bearer ')
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        constants.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403) // tokenda xato
            req.login = decoded.UserInfo.login;
            req.role = decoded.UserInfo.role
            next();
        }
    )
}

module.exports = verifyJWT;