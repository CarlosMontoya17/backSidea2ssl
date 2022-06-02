const controller = require("../controllers/capturistas.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderAvatar = require("../middlewares/uploaderAvatar");


module.exports = (app) => {
    app.post('/api/capturistas/register', verifyAuth,controller.signUp);
    app.post('/api/capturistas/ingresar', controller.signIn);
    app.post('/api/uploadAvatar/', verifyAuth, uploaderAvatar.upload.single('avatar') ,controller.upAvatar);
    app.get('/api/uploadAvatar/:id', controller.getAvatar);
    app.get('/api/prospectos/getAll', controller.getProspects);
    app.put('/api/prospectos/add', controller.addProspect);
}