const jwt = require('jsonwebtoken');


// check if Token exists on request Header and attach token to request as attribute
exports.checkTokenMW = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.CLIENT_SECRET, (err, authData) => {
                if (err) {
                    return res.status(403).send({
                        message: `Authentication Failed!`
                    });
                } else {
                    req.authData = authData;
                    next();
                }
            })
        }
        else {
            return res.status(401).send({
                message: "Authentication Failed!"
            });
        }
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
                    message: `Authentication Failed!`
                });
            } else {
                req.authData = authData;
                next();
            }
        })
    }
    else {
        return res.status(401).send({
            message: "Authentication Failed!"
        });
    }
};

// Issue Token
exports.signToken = (req, res, next) => {
    jwt.sign({ id: req.user.id, first_name: req.user.name.givenName, last_name: req.user.name.familyName, email: req.user.emails[0].value, name: req.user.displayName, auth_provider: req.user.provider }, process.env.CLIENT_SECRET, { expiresIn: '60 min' }, (err, token) => {
        if (err) {
            return res.sendStatus(500);
        } else {
            req.token = token;
            next();
        }
    });
}
