const jwt = require('jsonwebtoken'); 
const constants = require('../config/constants');
const { checkUserToken } = require('../repository/auth')


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies 
    if (!cookies.jwt){
        return res.sendStatus(401);
    } 
    const refreshToken = cookies.jwt
    const foundUser = await checkUserToken(refreshToken);  
    if (!foundUser) return res.sendStatus(403); //Forbideen 

    jwt.verify(
        refreshToken,
        constants.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.login !== decoded.login) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {
                    "UserInfo":{ 
                        "login" : decoded.login,
                        "role": foundUser.role_id
                    }
                },
                constants.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            )
            res.json({accessToken})
        }
    ) 
}

module.exports = { handleRefreshToken };