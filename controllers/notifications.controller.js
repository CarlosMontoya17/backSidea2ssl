const db = require("../models");
const Notifications = db.Notifications;


exports.newNotification = async (req, res) => {
    const { id_req, data } = req.body;

    await Notifications.create({
        id_req,
        data,
        view: false
    },
        { fields: ['id_req', 'data'] }).then(data => {
            if (data != 0) {
                res.status(201).json({ message: 'Created!' });
            }
            else {
                res.status(500).json({ message: 'Dont created!' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Dont created!' });
        });
}


exports.getMyNotifications = async (req, res) => {
    const id_req = req.usuarioID;

    await Notifications.findAll({ where: { id_req } }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getNewNotifications = async (req, res) => {
    const id_req = req.usuarioID;

    const notification = await Notifications.findOne({ where: { id_req, view: false } });
    if (notification.length > 0) {
        await Notifications.update({ view: true }, { where: { id: notification.id } }).then(data => {
            res.status(200).json(notification);

        }).catch(err => {
            res.status(500).json({message: 'No found!'});
        });
    }

}


exports.setNotify = async (req, res) => {
    const notify = { data: req.body};
    socket.emit('notification', notify);
    res.json(notify);

}