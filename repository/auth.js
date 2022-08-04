const db = require('../db/knex')

const checkUser = async (pLogin) => {
    const user = await db('users')
        .where('login', pLogin)
        .select()
        .first()
    return user;
}

const checkUserToken = async(pRefresh) => {
    const user = await db('users')
        .where('refresh_token', pRefresh)
        .select()
        .first()
    return user;
}

const updateRefresh = async (pLogin, pRefreshToken) => {
    await db('users')
        .where('login', pLogin)
        .update('refresh_token', pRefreshToken)
}

const deleteRefreshToken = async(pLogin) => {
    await db('users')
    .where('login', pLogin)
    .update('refresh_token', '')
}

module.exports.checkUser = checkUser;
module.exports.checkUserToken = checkUserToken;
module.exports.updateRefresh = updateRefresh;
module.exports.deleteRefreshToken = deleteRefreshToken;