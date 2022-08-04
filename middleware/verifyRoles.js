const verifyRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.role) return res.sendStatus(401)
        const rolesArray = [...roles]
        const result = rolesArray.includes(req.role )
        if(!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles