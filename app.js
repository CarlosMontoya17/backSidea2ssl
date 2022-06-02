const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
var pKey = fs.readFileSync('./actasalinstante_com.key');
var pCert = fs.readFileSync('./actasalinstante_com.crt');


const app = express();
const cron = require("./auto/cron");


app.use(cors());

const options = {
    key: pKey,
    cert: pCert
  }


const server = https.createServer(options, app).listen(3031, ()=> {
  console.log("Server working on port 3031");
});





app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
/*
app.listen(3030, () =>{
    console.log("Server is running");
});*/



app.use(express.json());
app.use(express.urlencoded({extended: false}));

//MW
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ welcome: "S I D E A - 2"})
});

cron.corte();

// const storage = multer.diskStorage({
//   destination:(req, file, cb) => {
//     cb(null, './assets/avatars')
//   },
//   filename:(req, file, cb) => {
//     const ext = file.originalname.split('.').pop();
//     cb(null, `${Date.now()}.${ext}`)
//   }
// });

// const upload = multer({storage});


// app.post('/api/uploadAvatar/', upload.single('avatar'), (req, res) => {
//     res.status(201).json({
//       message: 'Image was upload!'
//     });
// });

const socket = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
socket.on('connection', socket => {
  console.log("Socket!")
})

//Routes
require('./routes/users.routes')(app);
require('./routes/capturistas.routes')(app);
require('./routes/actas.routes')(app);
require('./routes/actas_req.routes')(app);
require('./routes/publicidad.routes')(app);
require('./routes/actas_reg.routes')(app);
require('./routes/notifications.routes')(app, socket);

