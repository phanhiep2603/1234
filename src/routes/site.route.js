const express = require('express');
const router = express.Router();

const sitesController = require('../app/controllers/sitesController')
const authController = require('../app/controllers/authsController');

    router.post('/search', sitesController.search)
    router.get('/deleteCart/:id', sitesController.deleteCart)
    router.post('/login-checkout', authController.loginCheckout)
    router.post('/checkout', sitesController.postcheckout)
    router.get('/checkout', sitesController.checkout)
    router.get('/update-cart', sitesController.updateCart);
    router.get('/cart-info', sitesController.cartInfo)
    router.post('/cart', sitesController.getCart);
    router.get('/productDetail/:id', sitesController.productDetail);
    router.get('/logout', authController.logout);
    router.get('/register', authController.authGetRegister);
    router.post('/register', authController.authPostRegister); 
    router.get('/login', authController.authGetLogin); 
    router.post('/login', authController.authPostLogin); 
    router.get('/contact', sitesController.siteContact);
    router.post('/contact', sitesController.postSiteContact);
    router.get('/', sitesController.index);

module.exports =  router;



