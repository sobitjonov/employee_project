const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const constants = require('../config/constants');
const { checkUser, updateRefresh } = require('../repository/auth')


const handleLogin = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ 'message': 'Login and password are required.' });
    const foundUser = await checkUser(login);  
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo":{ 
                    "login" : foundUser.login,
                    "role": foundUser.role_id
                }
            },
            constants.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        )
        const refreshToken = jwt.sign(
            {"login" : foundUser.login},
            constants.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        await updateRefresh(foundUser.login, refreshToken)
        res.cookie('jwt', refreshToken, {httpOnly:true, maxAge: 24*60*60*1000})
        res.json({accessToken});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };