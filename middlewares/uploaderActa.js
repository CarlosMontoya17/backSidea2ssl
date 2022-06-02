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
    cb(null, `./assets/actas/`)
  },
  filename:(req, file, cb) => {
    const name = file.originalname.split('.');
    cb(null, `${file.originalname}`)
  }
});



exports.upload = multer({storage});
