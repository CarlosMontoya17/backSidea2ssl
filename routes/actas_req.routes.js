const controller = require("../controllers/actas_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderActa = require("../middlewares/uploaderActa");
module.exports = function(app) {

    app.get("/api/actas/requests/obtainAll/", verifyAuth, controller.obtainAllRequets);
    app.post("/api/actas/requests/createOne/", verifyAuth, controller.createARequest);
    app.get("/api/actas/requests/getMyActa/:id", controller.getMyActa);

    // -- Robot Sidea --
    app.get("/api/actas/requests/getOneTask/", controller.getRequestNoAttended);
    app.put("/api/actas/requests/comment/:id", controller.commentsUp);
    app.post("/api/actas/robotUp/", uploaderActa.upload.single('acta'), controller.upPDF);
    app.get("/api/actas/requests/whomRequested/:id", verifyAuth ,controller.whomRequested);
}