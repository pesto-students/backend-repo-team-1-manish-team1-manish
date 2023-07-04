const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authMiddleware = require('./Middleware/AuthService');
const userOAuthRouter = require('./Routes/OAuthRoute');
const userAuthRouter = require('./Routes/AuthRoute');
const passport = require('passport');
const cors = require('cors');
const cookieSession = require('cookie-session');
require('dotenv').config();
const port = process.env.PORT || 5000
const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['carbazaar'],
    maxAge: 24 * 60 * 60 * 100,
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./DB/PostgresSql');
app.use(
    cors({
        origin: process.env.CORS_URL,
        credentials: true,
        optionSuccessStatus: 200,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: "Content-type,Accept,Access-Control-Allow-Credentials,Access-Control-Allow-Origin"
    })
);

app.use("/auth", userOAuthRouter);
app.use(authMiddleware.verifyToken);
app.use("/auth", userAuthRouter);


app.listen(port, () => console.log("server running on port" + port))