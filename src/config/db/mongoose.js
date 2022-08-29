const mongoose = require('mongoose');

async function connect(){
    try {
    await mongoose.connect(process.env.MONGODB_URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
      });
      console.log('Mongoose: Connect Mongodb successfullyy!!');
    } catch (err) {
      console.log(err);
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
      process.exit();
    }
}

module.exports = { connect }

