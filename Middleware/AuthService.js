const jwt = require('jsonwebtoken');


// check if Token exists on request Header and attach token to request as attribute
exports.checkTokenMW = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader.split(' ')[1];
        next();
    } else {
        return res.sendStatus(403);
    }
};

// Verify Token validity and attach token data as request attribute
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwtoken;
    if (token) {
        jwt.verify(token, process.env.CLIENT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).send({
                    code: 403,
                    message: `Auth Forbidden! error: ${err}`
                });
            } else {
                req.authData = authData;
                next();
            }
        })
    }
    else {
        return res.status(401).send({
            code: 401,
            message: "Un-Authorized!"
        });
    }
};

// Issue Token
exports.signToken = (req, res, next) => {
    jwt.sign({ userId: req.user.id, name: req.user.name, emails: req.user.emails, displayName: req.user.displayName, provider: req.user.provider }, process.env.CLIENT_SECRET, { expiresIn: '5 min' }, (err, token) => {
        if (err) {
            return res.sendStatus(500);
        } else {
            req.token = token;
            next();
        }
    });
}