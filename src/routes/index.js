const siteRouter = require('./site.route')


function route(app) {



    

    // Route Site Router 
    app.use('/', siteRouter);
}

module.exports = route;
