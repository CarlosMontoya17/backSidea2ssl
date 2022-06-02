const controller = require("../controllers/publicidad.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderPublicidad = require("../middlewares/uploaderPublicidad");


module.exports = (app) => {
        app.post('/api/ads/up/', verifyAuth, uploaderPublicidad.upload.single('ad') ,controller.upAd);
        app.get("/api/ads/getNames/", verifyAuth, controller.returnAll);
        app.get("/api/ads/getImage/:id", controller.returnImage);
}