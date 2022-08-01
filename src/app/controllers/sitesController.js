const AboutUsFooter = require('../models/about_us_footer');
const SystemStore = require('../models/system_store');
const LocalStorage = require('node-localstorage').LocalStorage; //import LocalStorage
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
localStorage = new LocalStorage('./scratch');

class SitesController {

    // [GET] /
    index(req, res, next) {
        res.render('home');
    }

    // [GET] /siteContact
    siteContact(req, res, next) {
        res.render('contact');
    }

    // // [PUT] /edit
    // putEdit(req, res, next) {
    //     SystemStore.findByIdAndUpdate(req.params.id, req.body)
    //         .then(() => res.redirect('list'))
    // }

    // // [GET] /edit
    // getEdit(req, res, next) {
    //     SystemStore.findById(req.params.id)
    //         .then(systemStoreByID => {
    //             res.render('editPlace', {
    //                 pageTitle: 'EditPage',
    //                 systemStoreByID: mongooseToObject(systemStoreByID),
    //             })
    //         })
    //         .catch(next);
    // }

    // // [Delete] /list
    // deleteEdit(req, res, next) {
    //     SystemStore.deleteOne({_id: req.params.id})
    //         .then(() => res.redirect('back'))
    //         .catch(next);
    // }

    // // [GET] /list
    // getList(req, res, next) {
    //     SystemStore.find({})
    //         .then(systemStore => {
    //             res.render('list', {
    //                 pageTitle: "List",
    //                 systemStore: multipleMongooseToObject(systemStore),
    //             })
    //         })
    //         .catch(next);
    // }

    // // [GET] /insertAboutus
    // getInsertAbout(req, res, next) {
    //     res.render('insert');
    // }

    // // [POST]  /insertAboutus
    // postInsertAbout(req, res, next) {
    //     const aboutUsFooter = new AboutUsFooter(req.body);
    //     aboutUsFooter.save()
    //         .then(() => {
    //             res.redirect('/');
    //         })
    //         .catch(next);
    // }

    // // [GET] /insertPlace
    // getInsertPlace(req, res, next) {
    //     res.render('insertPlace');
    // }

    // // [POST]  /insertPlace
    // postInsertPlace (req, res, next) {
    //     const systemStore = new SystemStore(req.body);
    //     systemStore.save()
    //         .then(() => {
    //             res.redirect('/');
    //         })
    //         .catch(next);
    // }


}

module.exports = new SitesController();