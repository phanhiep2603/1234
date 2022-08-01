const express = require('express');
const router = express.Router();

const sitesController = require('../app/controllers/sitesController')
const authController = require('../app/controllers/authsController');


    router.get('/register', authController.authGetRegister);
    router.post('/register', authController.authPostRegister); 
    router.get('/login', authController.authGetLogin); 
    router.get('/contact', sitesController.siteContact);
    router.get('/', sitesController.index);

module.exports =  router;



