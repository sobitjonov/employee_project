const jwt = require('jsonwebtoken');  
const { checkUserToken, deleteRefreshToken } = require('../repository/auth')


const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt
     
    const foundUser = await checkUserToken(refreshToken);  
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly:true})
        return res.sendStatus(204); //Forbideen 
    }

    await deleteRefreshToken(foundUser.login)
    res.clearCookie('jwt', {httpOnly: true}) 
    res.sendStatus(204) 
}

module.exports = { handleLogout };