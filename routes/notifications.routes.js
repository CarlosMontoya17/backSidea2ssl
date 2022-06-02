const controller = require("../controllers/notifications.controller");

module.exports =  (app, socket) => {
    app.post('/api/notify/newNotify/', 
    
    (req, res) => {
        const notify = { data: req.body};
        socket.emit('notification', notify);
        res.json(notify);
    
    });
}