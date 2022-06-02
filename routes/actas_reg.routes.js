const controller = require('../controllers/actas_reg.controller');
const verifyAuth = require('../middlewares/verifyAuth');
const uploaderDoc = require("../middlewares/uploaderDoc");

module.exports = (app) => {
    app.post("/api/actas/reg/load/", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/reg/up", verifyAuth ,controller.newActaRegister);
};