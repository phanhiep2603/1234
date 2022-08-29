const Users = require('../models/users');
const { multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const passport = require('passport');

const JWT_SECRET = 'asdjashdiuhg123nbmnbmnads@!@JK@<M!@?>!?!<>@!O:@JGH';


class AuthsController {

    // [GET] /Login
    authGetLogin(req, res, next) {
        res.render('auth/login', {
            pageTitle: 'Login'
        });
    }

    // authPostLogin(req, res, next) {
    //     const data = req.body;
    //     console.log(data.username);
    //     const validationErrors = [];

    //     if(validator.isEmpty(data.username)) validationErrors.push({ msg: 'Username cannot be blank.'});
    //     if(validator.isEmpty(data.password)) validationErrors.push({ msg: 'Password cannot be blank'});
    //     if(!validator.isLength(data.password, { min: 8, max: 50})) validationErrors.push({ msg: 'Password must be at least 8 characters long'});

    //     if(validationErrors.length) {
    //         req.flash('errors', validationErrors);
    //         return res.status(400).send({
    //             errors: true,
    //             validationErrors})
    //     }

    //     res.send('Hello');

         
    // }

    // [POST] /login //web
    authPostLogin(req, res, next) {
        const data = req.body;
        const validationErrors = [];

        if(validator.isEmpty(data.username)) validationErrors.push({ msg: 'Username cannot be blank.'});
        if(validator.isEmpty(data.password)) validationErrors.push({ msg: 'Password cannot be blank'});
        if(!validator.isLength(data.password, { min: 8, max: 50})) validationErrors.push({ msg: 'Password must be at least 8 characters long'});

        if(validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/login');
        }

        passport.authenticate('local', (err, user, info) => {
            if(err) next(err);
            if(!user) {
                req.flash('errors', info);
                return res.redirect('/login');
            }else {
                req.logIn(user, (err) => {
                    if (err) {return next(err)};
                    req.flash('success', { msg: 'Success! You are logged in.'})
                    return res.redirect('/');
                })
            }
            
        })(req, res, next)
    }

    // [GET] /Register
    authGetRegister(req, res, next) {
        res.render('auth/register', {
            pageTitle: 'Register Account',
        });
    }

    // [POST] /Register
    async authPostRegister(req, res, next) {
        const validationErrors = [];
        const data = req.body;

        if(!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.'});
        if(!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
        if (req.body.password !== req.body.rePassword) validationErrors.push({ msg: 'Passwords do not match' });

        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/register');
        }

        Users.findOne({ username: req.body.username})
            .then( user => {
                if (user) {
                    req.flash('errors', { msg: 'Account with that username address already exists.'})
                    return res.redirect('/register')
                } else {
                    return bcrypt.hash(data.password, 10)
                }
            })
            .then(hashPassword => {
                data.password = hashPassword
                const newUser = new Users(data);
                    return newUser.save();
            })
            .then( user => {
                let userTo = mongooseToObject(user)
                req.logIn(userTo, err => {
                    if (err) {
                        req.flash('errors', err)
                        next(err);
                    }
                })
                res.redirect('/');
            })
            .catch(err => next(err));
    }

    loginCheckout(req, res, next) {
        const data = req.body;
        const validationErrors = [];

        if(validator.isEmpty(data.username)) validationErrors.push({ msg: 'Username cannot be blank.'});
        if(validator.isEmpty(data.password)) validationErrors.push({ msg: 'Password cannot be blank'});
        if(!validator.isLength(data.password, { min: 8, max: 50})) validationErrors.push({ msg: 'Password must be at least 8 characters long'});

        if(validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/login');
        }

        passport.authenticate('local', (err, user, info) => {
            if(err) next(err);
            if(!user) {
                req.flash('errors', info);
                return res.redirect('/login');
            }else {
                req.logIn(user, (err) => {
                    if (err) {return next(err)};
                    req.flash('success', { msg: 'Success! You are logged in.'})
                    return res.redirect('/checkout');
                })
            }
            
        })(req, res, next)
    }

    // [POST] /logout
    
    logout(req, res, next) {
        req.logout(err => {
            if (err) {return next(err)}
            req.user = null;
            req.flash('success', { msg: 'Thanks you choice me. See you again!'})
            res.redirect('/');
        });
    }
}

module.exports = new AuthsController();