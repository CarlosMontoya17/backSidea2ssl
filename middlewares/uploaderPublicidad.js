const multer = require("multer");
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 
if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+mm+dd;

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './assets/ads')
  },
  filename:(req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    file.originalname = `${req.usuarioID}-${today}-${getRandomArbitrary(0, 50)}-${file.originalname}`;
    cb(null, `${file.originalname}`)
  }
});

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


exports.upload = multer({storage});

