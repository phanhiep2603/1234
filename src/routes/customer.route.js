const express = require('express');
const router = express.Router();
const CustomerController = require('../app/controllers/customerController');

    router.get('/orderHistory', CustomerController.orderHistory)
    router.put('/editaccount', CustomerController.putEditAccount);
    router.get('/editaccount', CustomerController.getEditAccount);
    router.get('/myaccount', CustomerController.myAccount);

module.exports =  router;



