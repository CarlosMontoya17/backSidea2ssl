const controller = require("../controllers/actas.controller");
const uploaderDoc = require("../middlewares/uploaderDoc");
const verifyAuth = require("../middlewares/verifyAuth");



module.exports = (app) => {
    app.post("/api/actas/load", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/up", verifyAuth ,controller.loadActa);
    app.get("/api/getMyCorteId/:id", controller.getMyCorte);

    app.get("/api/actas/getMyDocuments/:id", controller.getMyDocumentsUploaded);
    app.get("/api/actas/CountForEnterprise/:id", controller.countMyActasEnterprise);

    app.get("/api/actas/ClientsActuals/", verifyAuth, controller.clientsCurrent);
    app.get("/api/actas/CorteForSomeone/:id", controller.getCorteForOne);

    app.get("/api/actas/getMyDateCuts/:id", controller.getMyDatesCuts);
    app.get("/api/actas/getCutByDate/:id/:date", controller.getCorteDate);
    app.get("/api/actas/getMyClientsLevel/:level", verifyAuth, controller.documentsLevel);
    app.get("/api/actas/lowerToCut/", verifyAuth, controller.lowerToCut);

    app.get("/api/actas/ReadySend/", verifyAuth, controller.getReadySend);
    app.get("/api/actas/DontSend/", verifyAuth, controller.getDontSend);
    app.put("/api/actas/Send/:id", verifyAuth, controller.setSend);
    app.put("/api/actas/moveToTrash/", verifyAuth, controller.moveToTrash);
    app.get("/api/actas/Trash/", verifyAuth, controller.getTrash);

    app.get("/api/actas/getDatesCut/:id", controller.historialDate);
    
    app.put("/api/actas/changeDate/:id", verifyAuth, controller.changeDate);
    app.delete("/api/actas/deleteActa/:id", verifyAuth, controller.deleteActa);


    app.get("/api/actas/getAllDates/", verifyAuth, controller.getAllDates);
    app.get("/api/corte/getUsersByDate/:date", verifyAuth, controller.getUsersByDate);
    app.get("/api/actas/getCut/:id/:date", verifyAuth, controller.getCorte);
    
    //Historial
    app.get("/api/historial/getRegistersAt/:date", verifyAuth, controller.getRegistersAt);
};