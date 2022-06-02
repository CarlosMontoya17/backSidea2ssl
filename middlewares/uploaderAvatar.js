const multer = require("multer");


const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './assets/avatars')
  },
  filename:(req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.usuarioID}.jpg`)
  }
});



exports.upload = multer({storage});

