const db = require("../models");
const path = require("path");
const publicidad = db.Publicidad;
const Users = db.Users;

exports.upAd = async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'No file!' });
    }
    else {
        const { tipo } = req.body;

        const insert = await publicidad.create({
            nombre_archivo: req.file.originalname,
            tipo ,
            id_quien: req.usuarioID
        }, { field: ['nombre_archivo', 'tipo', 'id_quien']});

        if(insert){
            res.status(201).json({ message: 'Uploaded' });
        }
        else{
            res.status(500).json({ message: 'No uploaded!' });
        }

        
    }

}


exports.returnAll = async (req, res) => {
    const users = await Users.findAll();
    await publicidad.findAll().then(data => {
        
        let dataSend = [];
        for (let i = 0; i < data.length; i++) {
            
            var currentUser = users.find(element => {
                return element["id"] == Number(data[i].id_quien);
            });

            dataSend.push({
                "id": data[i].id,
                "nombre_archivo": data[i].nombre_archivo,
                "tipo": data[i].tipo,
                "creadoPor": currentUser.nombre,
                "createdAt": data[i].createdAt
            });

        }

        res.status(200).json(dataSend);
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'})
    });
}


exports.returnImage = async (req, res) => {
    const { id } = req.params;
    
    await publicidad.findOne({ where: { id }, attributes: ['nombre_archivo'] }).then(data => {        
        res.sendFile( path.join(__dirname, "..", "assets", "ads", data.nombre_archivo) );
    }).catch(err => {
        res.status(500).json({message: 'Dont found!'});
    });
}