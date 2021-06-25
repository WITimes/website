const passportLocal = require("passport-local");
const passport= require("passport");
const loginService = require("../services/loginService");

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
            usernameField: 'enrid',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, enrid, password, done) => {
            try {
                await loginService.findUserByEnrid(enrid).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `This user enrollment ID "${enrid}" doesn't exist`));
                    }
                    if (user) {
                        let match = await loginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));

};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportLocal;