const Contact = require('../models/contact');
const Products = require('../models/products');
const Users = require('../models/users');
const Bill = require('../models/bill');

var count = async (req, res, next) => {
    const mail = await Contact.count({ status: 0});
    const user = await Users.count();
    const bill = await Bill.count();
    const product = await Products.count();
    res.locals.count = {mail,user, bill, product};
    next()
}




module.exports = count;
