const multer = require('multer');
const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(appDir, 'public/upload'))
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  },
  
});
var upload = multer({ 
              storage: storage,
              fileFilter: function(req, file, cb) {
                if( 
                  file.mimetype == "image/jpeg" ||
                  file.mimetype == "image/png"
                ){
                  cb(null,true);
                } else {
                  console.log('Only jpg & png file supported')
                  cb(null, false);
                }
              }
              })

module.exports = upload