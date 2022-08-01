const mongoose = require('mongoose');

async function connect(){
    try {
    await mongoose.connect('mongodb://localhost:27017/News',{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      });
      console.log('Connect successfullyy!!');
    } catch (err) {
      console.log('Connect Failure!!!!')
    }
}

module.exports = { connect}

