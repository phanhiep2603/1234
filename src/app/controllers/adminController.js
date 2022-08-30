const Categories = require('../models/categories');
const { multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose');
const Products = require('../models/products');
const CategoryParent = require('../models/categoryParent');
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const Images = require('../models/images');
const Sizes = require('../models/sizes');
const Contact = require('../models/contact');
const Bill = require('../models/bill');
const fs = require('fs');
// const path = require('path');

// const { dirname } = require('path');
// const appDir = dirname(require.main.filename);

const { google } = require('googleapis');
  
class AdminController {

    // [GET] /admin
    index(req, res, next) {
        return res.render('admin/home', { layout: 'admin'});
        
    }

    // [GET] /admin/addCategory
    addCategory(req, res, next) {
        CategoryParent.find({})
            .then( cateParent => {
                res.render('admin/addCategory', { layout: 'admin', cateParent: multipleMongooseToObject(cateParent)});
            })
        
    }

    // [POST] /admin/addCategory
    postAddCategory(req, res, next) {
        const data = req.body;
        if(!data.categoryParent) {
            const newCateParent = new CategoryParent(data);
            newCateParent.save()
                .then(() => {
                    return res.redirect('addCategory');
                })
        }else {
            
            const parent = data.categoryParent;
            CategoryParent.findOne({ name: parent})
                .then( cateParent => {
                    const cate = new Categories({
                        name: data.name,
                        alias: data.name,
                        keyword: data.keyword,
                        parentId: cateParent._id,
                        description: data.description,
                    });
                    return cate.save();
                })
                .then( result => {
                    console.log(result);
                    if(result) {
                        return res.redirect('addCategory');
                    }
                })
                .catch( err => {
                            console.log(err)
                            req.flash('errors', err);
                            return res.redirect('/admin/listCategory');
                })
        }
    }

    // [GET] /admin/listCategory
    getListCategory(req, res, next) {
        Categories.find({})
            .populate('parentId')
            .then( cate => {
                if(cate) {
                    res.render('admin/listCategory', { layout: 'admin', cate: multipleMongooseToObject(cate)});
                }
            })
            .catch( err => {
                console.log(err)
                req.flash('errors', err);
                return res.redirect('/admin/listCategory');
            })
    }

    // [GET] /admin/listProduct
    ListProduct(req, res, next) {
        Products.find({})
            .then( product => {
                res.render('admin/listProduct', { layout: 'admin', product: multipleMongooseToObject(product)});
            })
            .catch( err => {
                req.flash('errors', { msg: err});
                req.redirect('/admin');
            })
    }

    // [GET] /admin/addProduct
    
    getAddProduct(req, res, next) {
        Categories.find({})
            .then( cate => {
                if(cate) {
                    res.render('admin/addProduct', { layout: 'admin', cate: multipleMongooseToObject(cate)});
                }
            })
            .catch( err => {
                req.flash('errors', { msg: err});
                req.redirect('/admin');
            })
    }

    // [POST] /admin/addProduct
    async postAddProduct(req, res, next) {
        const data = {...req.body};
        let file = req.file;
        let size = [];
        let fileData = {};

        if(!size) {
            req.flash('errors', { msg: 'Please insert size for product.'})
            res.redirect('back');
        }
        if(!file) {
            req.flash('errors', { msg: 'Please provide an image.'})
            res.redirect('back');
        }
        if(!data.category) {
            req.flash('errors', { msg: 'You must have choose Category'});
            res.redirect('/admin/addProduct');
        }

        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

        const oAuth2Client =  new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
        );

        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
        var drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
        })
        
        try{ 
            fileData = await drive.files.create({
                requestBody: {
                    name: file.filename,
                    mimeType: file.mimetype,
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(file.path)
                }
            })
            await drive.permissions.create({
                fileId: fileData.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
        } catch (err) {
            console.log(err)
        }
        console.log(fileData.data.id)
        data.sizeProduct.forEach((function(e) {
            size.push({ size: e.toUpperCase()})
        }));
        const images = new Images({ file: fileData.data.id });
        const sizes = new Sizes({ size: size })
        const imageId = await images.save();
        const sizeId = await sizes.save();
        Categories.findOne({ _id: data.category})
        .then( async cate => {
            const product = new Products({
                nameProduct: data.nameProduct,
                priceProduct: data.priceProduct,
                price_newProduct: data.price_newProduct,
                introProduct: data.introProduct,
                contentProduct: data.contentProduct,
                keywordsProduct: data.keywordsProduct,
                imageProduct: imageId._id,
                sizeProduct: sizeId._id,
                descriptionProduct: data.descriptionProduct,
                category: cate._id
            });
            return await product.save()
        })
        .then( result => {
            if (result) {
                req.flash('success', { msg: 'Add product success!'});
                res.redirect('/admin/listProduct');
            }
        })
        .catch( err => {
            console.log(err);
            req.flash('errors', { msg: err});
            res.redirect('/admin/addProduct');
        });
    }

    // [GET] /admin/product/:id
    detailProduct(req, res, next) {
        const id = req.params.id;
        Products.findOne({ _id: id})
            .then( product => {
                res.render('admin/detailProduct', { layout: 'admin', product: mongooseToObject(product)});
            })
            .catch( err => {
                
            })
    }

    // [PUT] /admin/product/:id
    putDetailProduct(req, res, next) {
        const data = req.body;
        const id = req.params.id;
        
        Products.findOneAndUpdate({ _id: id }, data)
            .then( product => {
                if (product) {
                    req.flash('success', { msg: 'Success! Product edited'});
                    res.redirect('/admin/listProduct');
                }
            }) 
            .catch( err => {
                req.flash('errors', { msg: err});
                req.redirect('/admin/listProduct');
            })
    }

    // [GET] /admin/listUser
    listUser(req, res, next) {
        Users.find({})
            .then( users => {
                res.render('admin/listUser', { layout: 'admin', users: multipleMongooseToObject(users)});
            })
            .catch( err => {
                req.flash('errors', { msg: err});
                req.redirect('/admin');
            })
    }

    // [GET] /admin/addUser
    addUser(req, res, next) {
        res.render('admin/addUser', { layout: 'admin'});
    }

    // [POST] /admin/addUser
    postAddUser(req, res, next) {
        const data = req.body;
        Users.findOne({ username: data.username })
            .then( user => {
                if ( user) {
                    console.log('1')
                    req.flash('errors', { msg: 'Username of User already exist'});
                    return res.redirect('/admin/addUser');
                } else {
                    return bcrypt.hash(data.password, 10)
                }
            })
            .then( hash => {
                if(hash) {
                data.password = hash;
                const newUser = new Users(data);
                return newUser.save()
                }
            })
            .then(  newUser => {
                if( newUser) {
                    req.flash('success', { msg: 'Add User success!'});
                    return res.redirect('/admin/listUser');
                }
            })
            .catch( err => {
                console.log(err)
                req.flash('errors', 'Create User failed');
                res.redirect('back');
            })
        
        
    }

    // [GET] /admin/user/:id
    detaiUser(req, res, next) {
        const id = req.params.id;
        Users.findOne({ _id: id})
            .then( user => {
                if(user) {
                    res.render('admin/detailUser', { layout: 'admin', user: mongooseToObject(user)});
                }
            })
            .catch( err => {
                req.flash('errors', err);
                res.redirect('/admin/listUser');
            })
    }
    // [PUT] /admin/user/:id
    putDetaiUser(req, res, next) {
        const data = req.body;
        const id = req.params.id;
        Users.findOne({ _id: id})
            .then( user => {
                if( user.password === data.password ) {
                    return Users.updateOne({ _id: id}, data);
                } else {
                    return bcrypt.hash(data.password, 10)
                }
            })
            .then( hash => {
                if (typeof hash === 'object') {
                    req.flash('success', { msg: 'Update User Success'});
                    res.redirect('/admin/listUser');
                } else {
                    data.password = hash;
                    return Users.updateOne({ _id: id}, data)
                }
            })
            .then( result => {
                if (result) {
                    req.flash('success', { msg: 'Update User Success'});
                    res.redirect('/admin/listUser');
                }
            })
            .catch ( err => {
                req.flash('errors', err);
                res.redirect('back');
            })
    }

    // [DELETE] /admin/listUser/:id
    destroyUser(req, res, next) {
        const id = req.params.id;
        Users.delete({ _id: id})
            .then(() => {
                req.flash('success', { msg: 'Delete User Success'})
                res.redirect('back');
            })
            .catch( err => {
                req.flash('errors', { msg: 'Oppp! Something went wrong'});
                res.redirect('back');
            } )
    }

    // [DELETE] /admin/listProduct/:id
    destroyProduct(req, res, next) {
        const id = req.params.id;
        Products.delete({ _id: id})
            .then(() => {
                req.flash('success', { msg: 'Product User Success'})
                res.redirect('back');
            })
            .catch( err => {
                req.flash('errors', { msg: 'Oppp! Something went wrong'});
                res.redirect('back');
            } )
    }
    mailbox(req, res, next) {
        Contact.find({})
            .then( contacts => {
                if(contacts) {
                    res.render('admin/mailbox', { layout: 'admin', contacts: multipleMongooseToObject(contacts)});
                }
            })
            .catch( err => next(err));
        
    }
    mailboxDetail(req, res, next) {
        const id = req.params.id;
        Contact.findOne({ _id: id})
            .then( contact => {
                if(contact) {
                    res.render('admin/mailboxDetail', { layout: 'admin', contact: mongooseToObject(contact)});
                }
            })
            .catch( err => next(err));
    }
    postMailboxDetail(req, res, next) {
        const id = req.params.id;
        const data = {...req.body};
        Contact.findOneAndUpdate({ _id: id}, data)
            .then( result => {
                if( result) {
                    res.redirect('/admin/mailbox');
                }
            })
            .catch( err => next(err));
    }

    getBill(req, res, next) {
        Bill.find({})
            .populate('userId')
            .then( bills => {
                if(bills) {
                    res.render('admin/listBill', { layout: 'admin', bills: multipleMongooseToObject(bills)});
                }
            })
    }

    getBillDetail(req, res, next) {
        const id = req.params.id;

        Bill.findOne({ _id: id})
            .populate('userId')
            .then( bill => {
                res.render('admin/billDetail', { layout: 'admin', bill: mongooseToObject(bill)});
            })
    }

    postBillDetail(req, res, next) {
        const id = req.params.id;
        const status = req.body;
        Bill.findOneAndUpdate({ _id: id }, status)
            .then( bill => {
                if( bill) {
                    req.flash('success', { msg: 'Update Bill Success!'});
                    res.redirect('/admin/bill');
                }
            })
    }
}

module.exports = new AdminController();