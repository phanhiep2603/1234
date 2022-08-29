const express = require('express');
const route = require('./routes/index'); // import route app
const Handlebars = require('express-handlebars'); // import express-handlebars
const db = require('./config/db/mongoose'); // import config DB
const methodOverride = require('method-override'); // import Method-override
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const flash = require('express-flash');
const passport = require('passport');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const session = require('express-session');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config()

 /**
  * API keys and Passport configuration.
  */
const passportConfirm = require("./config/passport/passport.js");

 /**
 * Create Express server.
 */
const app = express();



/**
* Connect to MongoDB.
*/
db.connect();



// Host and Port
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);

//Template Engine Express-Handlebars
app.engine('hbs', Handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'user',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
      sum: (a, b) => a+b,
      multiplication: (a, b) => a*b,
      upper: (String) => String.toUpperCase(),
      ifEquals: function(a, b, c) {
        if(a === b) {
          return c.fn(this);
        }  
        return c.inverse(this);
      },
      ifGreater: function(a, b, c) {
        if(a > b) {
          return c.fn(this);
        }  
        return c.inverse(this);
      },
      prettifyDate: function(a) {
        var curr_date = a.getDate();
        var curr_month = a.getMonth();
        curr_month++;
        var curr_year = a.getFullYear();
        result = curr_date + ". " + curr_month + ". " + curr_year;
        return result;
      },
      switch: function(value, options) {
        this.switch_value = value;
        this.switch_break = false;
        return options.fn(this);
      },
      case: function(value,options) {
        if(value == this.switch_value) {
          this.switch_break = true;
          return options.fn(this);
        }
      },
      default: function(value, b) {
        if ( this.switch_break == true){
          return value;
        }
      },
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'resources/views'));

// // Static File
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Express configuration.
 */

app.use(logger('dev')); // Logger use Morgan

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // Session
app.use(session({
  secret: 'lalalalalal123213',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    // maxAge: 5 * 60 * 1000,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  }
}))


// // Passport
app.use(passport.initialize());
app.use(passport.session());

// // Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.count = req.count;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

/**
* Method-override.
*/
app.use(methodOverride('_method'))

/**
* Route App.
*/
route(app);

// if (process.env.NODE_ENV === 'development') {
//   // only use in development
//   app.use(errorHandler());
// } else {
//   app.use((err, req, res) => {
//     console.error(err);
//     res.status(500).send('Server Error');
//   });
// }

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
  console.log('Press CTRL-C to stop');
})


// mongodb+srv://phanhiep2603:<password>@cluster0.8tdqv3j.mongodb.net/?retryWrites=true&w=majority