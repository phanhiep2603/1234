const express = require('express');
const route = require('../src/routes/index'); // import route app
const handlebars = require('express-handlebars'); // import express-handlebars
const db = require('../src/config/db/mongoose'); // import config DB
const methodOverride = require('method-override'); // import Method-override
const path = require('path');
const app = express();
const port = 3000;

// Static File
app.use(express.static(path.join(__dirname, 'public')));

// App Use Method-override
app.use(methodOverride('_method'))

// Connect DB
db.connect();

//Template Engine Express-Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a+b,
        upper: (String) => String.toUpperCase(),
      },
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'resources/views'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/test', (req, res) => {
  res.render('test');
})

// Route App
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})