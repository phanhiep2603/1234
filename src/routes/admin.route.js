const express = require('express');
const router = express.Router();
const upload = require('../app/middleware/uploadMiddleware');

const adminController = require('../app/controllers/adminController');

    router.post('/bill/:id', adminController.postBillDetail);
    router.get('/bill/:id', adminController.getBillDetail);
    router.get('/bill', adminController.getBill);
    router.post('/mailbox/:id', adminController.postMailboxDetail);
    router.get('/mailbox/:id', adminController.mailboxDetail);
    router.get('/mailbox', adminController.mailbox);
    router.delete('/listProduct/:id', adminController.destroyProduct);
    router.delete('/listUser/:id', adminController.destroyUser);
    router.put('/user/:id', adminController.putDetaiUser);
    router.get('/user/:id', adminController.detaiUser);
    router.post('/listUser', adminController.postAddUser);
    router.post('/addUser', adminController.postAddUser);
    router.get('/addUser', adminController.addUser);
    router.get('/listUser', adminController.listUser);
    router.put('/listProduct/:id', adminController.putDetailProduct)
    router.get('/listProduct/:id', adminController.detailProduct)
    router.post('/addProduct', upload.array('imageProduct', 5),adminController.postAddProduct);
    router.get('/addProduct', adminController.getAddProduct);
    router.get('/listProduct', adminController.ListProduct);
    router.get('/listCategory', adminController.getListCategory);
    router.post("/addCategory", adminController.postAddCategory);
    router.get('/addCategory', adminController.addCategory);
    router.get('/', adminController.index);

module.exports = router;