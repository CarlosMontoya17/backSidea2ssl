const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");

module.exports = function verifyAuth (req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const decoded = jwt.verify(token, cnfg.secret);
    req.usuarioRol = decoded.rol;
    req.usuarioID = decoded.id;
    next();
}