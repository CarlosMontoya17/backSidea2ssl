const database = require("../models");
const Capturistas = database.Capturistas;
const Prospectos = database.Prospectos;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");
const path = require("path");


exports.signUp = async (req, res) => {
    const { usuario, password, avatar, email, telefono, estado } = req.body;
    try {
        let isAlready = await Capturistas.findOne({where: { usuario }}); 
        if(!isAlready){
            let salt = await bcryptjs.genSalt(10);
            let hashing = await bcryptjs.hash(password, salt);
            let user  = await Capturistas.create({
                usuario,
                password: hashing,
                avatar,
                email,
                telefono,
                estado,
                status: true
            }, { field: ['usuario', 'password', 'avatar', 'email', 'telefono', 'estado', 'status']});
    
            if(user){
                return res.status(201).json({
                    message: 'User Created',
                    data: user
                });
            }
        } 
        
        res.status(200).json({
            message: 'User already exist'
        });
    } catch (error) {
        res.status(500).json({message: error})
    }
}

exports.signIn = async (req, res) => {
    const { usuario, password } = req.body;
    let user = await Capturistas.findOne({where: { usuario }});
    if(!user){
        return res.status(404).json({
            message: "User don't found"
        });
    }
    let compare = bcryptjs.compareSync(password, user.password);
    if(!compare){
        return res.status(401).json({
            message: "Invalid password!"
        });
    }
    const token = jwt.sign({usuario: usuario, id: user.id}, cnfg.secret, {expiresIn: 60 * 60 * 24});
    res.status(200).json({
        token: token
    });
}

exports.upAvatar = (req, res) => {
   const id = req.usuarioID;
   const file = req.file;
    if(!file){
        res.status(500).json({message: 'Please upload a file'});
    }
    res.send(file);
}


exports.getAvatar = (req, res) => {
    const { id } = req.params;
    try {
        res.sendFile(path.resolve('assets/avatars/'+id+'.jpg'));
    } catch (error) {
        res.status(500).json({error});
    }
}


exports.getProspects = (req, res) => {
    Prospectos.findAll().then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send(err)
    });
}

exports.addProspect = async (req, res) => {
    const { 
        fechacontacto, 
        nombre, 
        apellido, 
        contacto, 
        movil, 
        nombrefacebook, 
        linkperfil, 
        celularbandeja, 
        correobandeja, 
        cuidaddondevive, 
        tipodenegocio, 
        status, 
        comentarios, 
        notas, 
        referidopor
    } = req.body;

    try {
        const exist = await Prospectos.findOne({where: {nombre, apellido}})
        if(!exist){
            const prospecto = await Prospectos.create({
                fechacontacto, 
                nombre, 
                apellido, 
                contacto, 
                movil, 
                nombrefacebook, 
                linkperfil, 
                celularbandeja, 
                correobandeja, 
                cuidaddondevive, 
                tipodenegocio, 
                status, 
                comentarios, 
                notas, 
                referidopor
            }, {field: [
            "fechacontacto", 
            "nombre", 
            "apellido", 
            "contacto", 
            "movil", 
            "nombrefacebook", 
            "linkperfil", 
            "celularbandeja", 
            "correobandeja", 
            "cuidaddondevive", 
            "tipodenegocio", 
            "status", 
            "comentarios", 
            "notas", 
            "referidopor"]});
        
            if(!prospecto){
                return res.status(500).json({message: 'Internal error!'});
            }
        
            return res.status(200).json({message: 'Prospecto creado'});
        }
        res.status(302).json({message: 'Prospect are exist!'})

    } catch (error) {
        res.status(500).json({message: error});
    }

    
    

}