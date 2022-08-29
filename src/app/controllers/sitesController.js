const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Products = require('../models/products');
const Bill = require('../models/bill');
const Contact = require('../models/contact');
const validator = require('validator');

class SitesController {

    // [GET] /
    index(req, res, next) {
        // const cart = req.session.cart ? req.session.cart : [];
        Products.find({})
            .populate('imageProduct', 'file')
            .populate('sizeProduct', 'size')
            .then( products => {
                if( products) {
                    // res.json(products);
                    res.render('home', { products: multipleMongooseToObject(products)});
                }
            })
    }

    // [GET] /siteContact
    siteContact(req, res, next) {
        res.render('contact');
    }
    postSiteContact(req, res, next) {
        const data = {...req.body};
        if(data) {
            const contact = new Contact(data);
            contact.save()
                .then( result => {
                    if (result) {
                        req.flash('success', { msg: 'Your submission is received and we will contact you soon. Thank you!'});
                        res.redirect('/')
                    }
                })
                .catch( err => next(err));
        }
    }

    productDetail(req, res, next) {
        Products.findOne({ _id: req.params.id})
            .populate('imageProduct', 'file')
            .populate('sizeProduct', 'size')
            .then( product => {
                // res.json(product)
                return res.render('user/productDetail', { product: mongooseToObject(product)})
            })
            .catch( err => {
                req.flash('errors', { msg: 'Oppp, Something went wrong'});
                res.redirect('/');
            })
    }

    getCart(req, res, next) {
        let data = {...req.body}
        Products.findOne({ _id: data.productId})
            .populate('imageProduct', 'file')
            .then( product => {
                data.priceProduct = product.price_newProduct == 0 ? product.priceProduct : product.price_newProduct;
                data.nameProduct = product.nameProduct;
                data.imageProduct = product.imageProduct;
                const cart = (req.session.cart ? req.session.cart : []);
                cart.push(data)
                req.session.cart = cart;
                req.flash('success', { msg: 'Add to cart success!'})
                res.redirect('back');
            })
        
    }

    cartInfo(req, res, next) {
        const cart = req.session.cart ? req.session.cart : [];
        // res.json(cart)
        res.render('user/cartInfo', {cart});
    }

    updateCart(req, res, next) {
        const cart = req.session.cart ? req.session.cart : [];
        const update = cart.findIndex((obj => obj.productId === req.query.id));
        cart[update].quantity = req.query.qty;
        res.send(cart);
    }
    checkout(req, res, next) {
        const cart = req.session.cart ? req.session.cart : [];
        console.log(cart.length)
        if (cart.length) {
            res.render('user/checkout');
        } else {
            req.flash('errors', { msg: 'You need add to cart at least 1 product'});
            res.redirect('/');
        }
    }

    postcheckout(req, res, next) {
        const cart = req.session.cart ? req.session.cart : [];
        const user = req.user;
        const data = {...req.body};
        let result = 0;
        let userId = null;
        const validationErrors = [];

        if(validator.isEmpty(data.fullname)) validationErrors.push({ msg: 'Fullname cannot be blank'});
        if(validator.isEmpty(data.email)) validationErrors.push({ msg: 'Email cannot be blank'});
        if(!validator.isEmail(data.email)) validationErrors.push({ msg: 'Incorrect email format, example: yourfullname@gmail.com'}); 
        if(validator.isEmpty(data.phone)) validationErrors.push({ msg: 'Phone cannot be blank'});
        if(validator.isEmpty(data.address)) validationErrors.push({ msg: 'Address cannot be blank'});

        if(cart.length == 0) {
            req.flash('errors', { msg: 'You need add to cart at least 1 product'});
            return res.redirect('/');
        }

        if(validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('checkout');
        }
        user ? userId = user._id : userId = null;

        cart.forEach( (e) => {
            result += (e.priceProduct * e.quantity);
        })
        let tax = result * 10/100;
        let total = result + tax;

        const bill = new Bill({
            userId,
            total,
            cart,
            payment: data.payment,
            fullname: data.fullname,
            email: data.email,
            address: data.address,
            phone: data.phone,
            note: data.note,
        })
        bill.save()
            .then( e => {
                delete req.session.cart
                req.flash('success', { msg: 'Your order panding resolve'});
                res.redirect('/');
            })
            .catch( err => {
                console.log(err);
                req.flash('errors', { msg: 'Oppp, Something went wrong'});
                res.redirect('/');
            })  
    }

    deleteCart(req, res, next) {
        const productId = req.params.id;
        let cart = req.session.cart ? req.session.cart : [];
        
        if(cart) {
            cart = cart.filter(obj => obj.productId !== productId )
        }
        req.session.cart = cart;
        req.flash('success', { msg: 'Product removed'});
        res.redirect('back');

    }

    search(req, res, next) {
        const searchKey = req.body.key_search;
        const regex = new RegExp(searchKey,'i');
        Products.find({$or: [{ nameProduct: regex},{keywordsProduct: regex} ]})
            .populate('imageProduct', 'file')
            .populate('sizeProduct', 'size')
            .then( products => {
                // res.json(products)
                res.render('user/search', { products: multipleMongooseToObject(products), searchKey});
            })
            .catch( err => next(err));
    }
    
}

module.exports = new SitesController();