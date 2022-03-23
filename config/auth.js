require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token  = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.status(403).send({ message: err.message });
        req.user = user;
        return next()
    });
}

module.exports = authenticateToken