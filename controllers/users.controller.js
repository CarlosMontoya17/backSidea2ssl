const database = require("../models");
const Users = database.Users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};
const path = require("path");
const { Op } = require("sequelize");


exports.signIn = (req, res) => {
    const { username, password } = req.body;
    Users.findOne({
        where: { username }
    }).then(data => {
        if (!data) {
            return res.status(404).json({
                message: "User don't found"
            });
        }
        else {
            const validate = bcrypt.compareSync(password, data.password);
            if (!validate) {
                return res.status(401).json({
                    message: 'Invalid Password'
                });
            }
            else {

                const token = jwt.sign({ username: username, rol: data.rol, id: data.id }, cnfg.secret, {
                    expiresIn: 60 * 60 * 24
                });
                res.status(200).json({
                    id: data.id,
                    username: data.username,
                    token: token
                });
            }
        }
    }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
}

exports.getAll = async (req, res) => {

    Users.findAll({
        order: [
            ['id', 'ASC']
        ]
    }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).json({
            message: "Internal Error"
        })
    });
}

exports.getMyClients = async (req, res) => {
    const id = req.params.id;

    if(id != 1){
        const users = await Users.findAll({ where: { idSuper: id }, order: [
            ['id', 'ASC']
        ] });
    
        if (!users) {
            return res.status(500).json({
                message: 'Not users'
            });
        }
        else {
            return res.status(200).send(users);
        }
    }
    else{
        const users = await Users.findAll({order: [
            ['id', 'ASC']
        ] });
    
        if (!users) {
            return res.status(500).json({
                message: 'Not users'
            });
        }
        else {
            return res.status(200).send(users);
        }
    }
    

}

exports.editPrecios = async (req, res) => {
    const { id } = req.params;
    const { precios, username, password, nombre, type } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hasedPs = await bcrypt.hash(password, salt);

    if(password.length != 0){
        await Users.update({ precios,username, password: hasedPs, nombre, type }, {where: { id }}).then(data => {
            if(data == 1){
                return res.status(200).json({
                    message: 'User updated!'
                });
            }
        }).catch(err => { 
            return res.status(500).send(err);
        });
    }
    else{
        await Users.update({ precios,username, nombre, type }, {where: { id }}).then(data => {
            if(data == 1){
                return res.status(200).json({
                    message: 'User updated!'
                });
            }
        }).catch(err => { 
            return res.status(500).send(err);
        });
    }
    

}


exports.getMyProvider = async (req, res) => {
    const { rol } = req.params;
    var users;
    switch (rol) {
        case "Asesor":
            users = await Users.findAll({where: { rol: ['Supervisor', 'Admin' ]}, order: [['id', 'ASC']]  });
            break;
        case "Cliente":
            users = await Users.findAll({ where: { rol: ['Supervisor', 'Asesor', 'Admin'] }, order: [['id', 'ASC']]  });
            break;
        case "Sucursal":
            users = await Users.findAll({ where: { rol: ['Supervisor', 'Asesor', 'Cliente', 'Admin'] } , order: [['id', 'ASC']] });
            break;
        case "Empleado":
            users = await Users.findAll({ where: { rol: ['Supervisor', 'Asesor', 'Cliente', 'Sucursal', 'Admin']}, order: [['id', 'ASC']]  });
            break;
        default:
            users = [];
            break;
    }
    if (!users) {
        return res.status(500).json({
            message: 'Not users'
        });
    }
    else {
        return res.status(200).send(users);
    }
}

exports.getOne = async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({
        where: { id }
    });
    res.json({
        data: user
    });
}


exports.create = async (req, res) => {
    const { username, password, rol, type, idSuper, precios, status, nombre } = req.body;
    try {
        let userExist = await Users.findOne({ where: { username } });
        if(userExist != null){
            return res.status(304).json({
                message: 'User already exist'
            });
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hasedPs = await bcrypt.hash(password, salt)
            let newUser = await Users.create({
                username,
                password: hasedPs,
                rol,
                type,
                idSuper,
                precios,
                status,
                nombre
            }, {
                fields: ['username', 'password', 'rol', 'type', 'idSuper', 'precios', 'status', 'nombre']
            });
            if (newUser) {
                return res.status(201).json({
                    message: 'User created',
                    data: newUser
                });
            }
        }        
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.deleteUser = async (req, res, next) => {
    const rol = req.usuarioRol;
    if (rol == "") {
        res.status(401).json({
            message: "Don't have auth"
        });
    }
    else {
        const { id } = req.params;
        await Users.destroy({
            where: { id }
        }).then(data => {
            if (data == 0) {
                return res.status(404).json({
                    message: 'User dont found'
                });
            }
            else {
                return res.status(200).json({
                    message: 'User deleted'
                });
            }

        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Error'
            });
        });
    }

}

exports.updatedUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, rol, type, idSuper, precios, crm } = req.body;


    const salt = await bcrypt.genSalt(10);
    const hasedPs = await bcrypt.hash(password, salt)
    await Users.update({
        username,
        password: hasedPs,
        rol,
        type,
        idSuper,
        precios,
        crm,
        nombre
    }, { where: { id } }).then(data => {
        if (data == 0) {
            res.sendStatus(500);
        }
        else {
            res.json({
                message: 'User was updated'

            });
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Error while user trying updated'
        });
    });
}


exports.updatePrecios = async (req, res) => {
    const { precios } = req.body;
    await Users.update({
        precios
    }, { where: { id: { [Op.gte]: 386 } } }).then(data => {
        if (data == 0) {
            res.sendStatus(500);
        }
        else {
            res.json({
                message: 'Prices was updated'

            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Error while user trying updated'
        });
    });

}


exports.hasheo = async (req, res) => {
    const { secret } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hasedPs = await bcrypt.hash(secret, salt)
    res.send(hasedPs);
}

exports.newServices = async (req, res) => {
    const { id } = req.params;
    const { precios } = req.body;

    await Users.update({
        precios
    }, { where: { id } }).then(data => {
        if (data == 0) {
            res.sendStatus(500);
        }
        else {
            res.json({
                message: 'Prices was updated'

            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Error while user trying updated'
        });
    });
}

exports.getAllCibers = async (req, res) => {
    const data = await Users.findAll({ where: { rol: 'Cliente' }, attributes: ['id', 'nombre'] });
    if (data) { res.status(200).json(data); }

}

exports.getMyData = async (req, res) => {
    const { id } = req.params;
    const { tipo, estado } = req.body;
    const { idSuper, precios } = await Users.findOne({ where: { id }, attributes: ['idSuper', 'precios'] });
    if (idSuper) {

        var datos = {};
        try{
            if (tipo == 'nac' && Object.keys(precios[tipo]).length > 2) {
                if (estado) {
                    datos.precio = precios[tipo][estado];
                }
                else {
                    return res.status(500).json({ message: 'Indicate State/Mun' });
                }
    
            }
            else {
                datos.precio = precios[tipo];
            }
        }
        catch{
            datos.precio = 0;
        }
        
        
        const { username, id } = await Users.findOne({ where: { id: idSuper }, attributes: ['username', 'id'] });
        datos.superviser = id;
        return res.send(datos);
    }
    else {
        return res.status(404).json({ message: 'without a Superviser' })
    }
}


exports.allLower = async (req, res) => {
    const id = req.usuarioID;
    Users.findAll({where: { idSuper: id }}).then(data => {
        if(data.length != 0){
            res.status(200).json(data);
        }
        else{
            res.status(404).json({message: 'No found'});
        }
    }).catch(err => {
        res.status(500).json({ message: 'Internal error!' });
    });
}