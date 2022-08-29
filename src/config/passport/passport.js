const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const Users = require('../../app/models/users');


passport.serializeUser((user, done) => {
    done(null,user);
});

passport.deserializeUser((username, done) => {
    Users.findOne(username, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'username'}, async (username, password, done) => {
    await Users.findOne({ username}).lean()
        .then( async (user) => {
            if (!user) {
                return done(null,false, {msg: `Username ${username} not found!`});
            }
            if (!user.password) {
                return done(null, false, { msg: `Password incorrectly!`})
            }
            await bcrypt.compare(password, user.password, (err, result) => {
                if (err) {return done(err);}
                if(result) {return done(null, user)}
                return done(null, false, { msg: 'Invalid username or password.' });
            })
        })
        .catch(err => {
            return done(err);
        })
}))
/**
 * Login Required middleware.
 */
exports.isAuthenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.level <= 1) {
            return next();
    }
    req.flash('errors', { msg: 'You don\'t have permission'});
    res.redirect('/login');
  };
exports.isAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.level <=2) {
        return next();
    }
    req.flash('errors', { msg: 'You must have login'});
    res.redirect('/login');
  };
// exports.isAuthorized = (req, res, next) => {
// const provider = req.path.split('/')[2];
// const token = req.user.tokens.find((token) => token.kind === provider);
// if (token) {
//     // Is there an access token expiration and access token expired?
//     // Yes: Is there a refresh token?
//     //     Yes: Does it have expiration and if so is it expired?
//     //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
//     //       No, Quickbooks and Google- refresh token and save, and then go to next();
//     //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
//     // No: we are good, go to next():
//     if (token.accessTokenExpires && moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
//     if (token.refreshToken) {
//         if (token.refreshTokenExpires && moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
//         res.redirect(`/auth/${provider}`);
//         } else {
//         refresh.requestNewAccessToken(`${provider}`, token.refreshToken, (err, accessToken, refreshToken, params) => {
//             User.findById(req.user.id, (err, user) => {
//             user.tokens.some((tokenObject) => {
//                 if (tokenObject.kind === provider) {
//                 tokenObject.accessToken = accessToken;
//                 if (params.expires_in) tokenObject.accessTokenExpires = moment().add(params.expires_in, 'seconds').format();
//                 return true;
//                 }
//                 return false;
//             });
//             req.user = user;
//             user.markModified('tokens');
//             user.save((err) => {
//                 if (err) console.log(err);
//                 next();
//             });
//             });
//         });
//         }
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
//     } else {
//     next();
//     }
// } else {
//     res.redirect(`/auth/${provider}`);
// }
// };  