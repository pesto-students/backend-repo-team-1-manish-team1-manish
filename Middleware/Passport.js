const passport = require("passport");
require("dotenv").config();

const { CLIENT_ID, CLIENT_SECRET, DEV_CALLBACK_URL, PROD_CALLBACK_URL } =
  process.env;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "dev" ? DEV_CALLBACK_URL : PROD_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
