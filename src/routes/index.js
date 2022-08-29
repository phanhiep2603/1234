const siteRouter = require('./site.route')
const customerRouter = require('./customer.route')
const adminRouter = require('./admin.route')
/**
 * API keys and Passport configuration.
 */
 const passportConfig = require('../config/passport/passport');
 const  count = require('../app/middleware/count');

function route(app) {

    // Route Admin Router
    app.use('/admin', passportConfig.isAuthenticatedAdmin, count,adminRouter);
    // Route Site Router 
    app.use('/customer', passportConfig.isAuthenticatedUser, customerRouter);
    // Route Site Router 
    app.use('/', siteRouter);
}

module.exports = route;

