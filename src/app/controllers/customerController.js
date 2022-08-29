const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const Users = require('../models/users');
const Bill = require('../models/bill');
const validator = require('validator');
const bcrypt = require('bcrypt');


class CustomerController {
    // [GET] /Myaccount
    myAccount(req, res, next) {
        res.render('user/myAccount', { pageTitle: 'My Account' })
    }


    // [GET] /customer/EditAccount
    getEditAccount(req, res, next) {
        res.render('user/editAccount', {pageTitle: 'My Account'})
    }

    // [PUT] /customer/EditAccount
    putEditAccount(req, res, next) {
        const data = req.body;
        const validationErrors = [];
        
        if(!req.user) {
            req.flash('errors', { msg: 'You must have Login before'});
            return res.redirect('/login');
        }

        if(validator.isEmpty(data.password)) validationErrors.push({ msg: 'Password cannot be blank'});
        if(!validator.isLength(data.password, { min: 8, max: 50})) validationErrors.push({ msg: 'Password must be at least 8 characters long'});

        if(validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.status(400).send(validationErrors)
        }

        Users.findOne({ username: req.body.username})
            .then( user => {
                if(user) {
                    bcrypt.hash(data.password, 10, (err, result) => {
                        if (err) {return next(err)};
                        data.password = result;
                        Users.updateOne({username: user.username},data)
                            .then(() => {
                                req.logIn(user, (err) => {
                                    if (err) {return next(err)};
                                    res.redirect('/customer/myaccount');
                                })
                            })
                    })
                    
                }
            })


    }

    orderHistory(req, res, next) {
        Bill.find({ userId: req.user._id})
            .then( bills => {
                if(bills) {
                    res.render('user/orderHistory', { bills: multipleMongooseToObject(bills)});
                }
            })
            .catch( err => {
                console.log(err);
                req.flash('errors', { msg: 'Oppp, Something went wrong'});
                res.redirect('/');
            })
    }
}

module.exports = new CustomerController();