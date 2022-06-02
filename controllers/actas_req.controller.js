const db = require("../models");
const actas_req = db.Actas_req;
const Op = db.Sequelize.Op;
const path = require('path');

exports.createARequest = async (req, res) => {
    const id_req = req.usuarioID;
    
    // if(id_req == 983){
        const { type, metadata, preferences } = req.body;


        console.log(id_req);
        await actas_req.create({
            type,
            metadata,
            id_req,
            send: false,
            preferences,
            ip_req: req.ip
        }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req'] }).then(data => {
            res.status(201).json({ message: 'Created!' })
        }).catch(err => {
            res.status(500).json(err);
        });
    // }
    // else{
    //     res.status(500).json({message: 'NO HAVE AUTH!'})
    // }
    

    
}

exports.getRequestNoAttended = async (req, res) => {
    await actas_req.findOne({ where: { [Op.or]: [{comments: null}, {comments: ""}, {[Op.and]: [{comments: "Enviado"}, {url: null}]}] }, attributes: ['id', 'type', 'metadata', 'id_req'], order: [['id', 'ASC']] }).then(data => {
        actas_req.update({ send: true }, { where: { id: data.id } });
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.commentsUp = async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    await actas_req.update({
        comments
    }, { where: { id } }).then(data => {
        res.status(200).json({ message: 'Update!' });
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}


exports.obtainAllRequets = async (req, res) => {
    const id = req.usuarioID;

    // if(id != 1){
    //     await actas_req.findAll({
    //         where: { id_req: id }, order: [['createdAt', 'DESC']]
    //     }).then(data => {
    //         res.status(200).json(data);
    //     }).catch(err => {
    //         res.status(500).json({
    //             message: 'Internal Error!'
    //         })
    //     });
    // }
    // else{
    //     await actas_req.findAll({
    //         order: [['createdAt', 'DESC']]
    //     }).then(data => {
    //         res.status(200).json(data);
    //     }).catch(err => {
    //         res.status(500).json({
    //             message: 'Internal Error!'
    //         })
    //     });
    // }

    await actas_req.findAll({
        where: { id_req: id }, order: [['createdAt', 'DESC']]
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({
            message: 'Internal Error!'
        })
    });
}

exports.upPDF = async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'No file!' });
    }
    else {
        const nameFile = req.file.originalname;
        var array = nameFile.split("-");
        var id = array[0];
        var path = nameFile
        await actas_req.update({
            url: path
        }, { where: { id: Number(id) } }).then(data => {
            res.status(201).json({ message: 'Ready' });
        }).catch(err => {
            res.status(500).json({ message: 'Internal Error!' });
        });


    }

}

exports.whomRequested = async (req, res) => {
    const { id } = req.params;

    await actas_req.findOne({ where: { id }, attributes: ['id_req', 'preferences', 'metadata', 'type'] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });


}


exports.getMyActa = async (req, res) => {
    const { id } = req.params;

    await actas_req.findOne({ where: { id }, attributes: ['url'] }).then(data => {

        res.sendFile(path.join(__dirname, "..", "assets", "actas", data.url));

    }).catch(err => {
        res.status(500).json(err);
    });

}