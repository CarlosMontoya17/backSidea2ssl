const database = require("../models");
const Actas = database.Actas;
const Users = database.Users;
const Op = database.Sequelize.Op;
const path = require("path");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};


exports.upPDF = (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'Please upload a file' });
    }
    else {
        var data = {};
        pdfExtract.extract(path.resolve('assets/docs/' + file.originalname), options).then(data => {
            const page = data.pages[0].content;
            const tipo = page[13].str;
            const tipo2 = page[10].str;
            let paginaString = [];
            for (let i = 0; i < page.length; i++) {
                paginaString.push(page[i].str);

            }
            let curp, estado, nombre, apellidos;
            if (tipo.includes("Acta")) {
                switch (tipo) {
                    case "Acta de Nacimiento":
                        curp = page[2].str;
                        estado = page[10].str;
                        nombre = page[21].str;
                        apellidos = page[23].str + " " + page[25].str;
                        if (nombre == " ") {
                            let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                            nombre = paginaString[personaregistrada + 1]
                        }
                        if (apellidos == "  ") {
                            let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                            apellidos = paginaString[personaregistrada + 3] + " " + paginaString[personaregistrada + 5]
                        }
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Defunción":
                        curp = page[4].str;
                        estado = page[8].str;
                        nombre = page[31].str;
                        apellidos = page[32].str + " " + page[34].str;
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Matrimonio":
                        curp = page[4].str;
                        estado = page[8].str;
                        nombre = page[31].str;
                        apellidos = page[32].str + " " + page[34].str;
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    default:
                        res.status(500).json({ message: "Error" })
                        break
                }
            }
            else if (tipo2.includes("Acta")) {
                switch (tipo2) {
                    case "Acta de Divorcio":
                        curp = page[2].str;
                        estado = page[7].str;
                        nombre = page[24].str;
                        apellidos = page[26].str + " " + page[28].str;
                        data = { tipo: tipo2, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Matrimonio":
                        curp = page[2].str;
                        estado = page[7].str;
                        nombre = page[22].str;
                        apellidos = page[24].str + " " + page[26].str;
                        data = { tipo: tipo2, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    default:
                        res.status(500).json({ message: "Error" })
                        break
                }
            }
            else if (page[59].str == "Constancia de Vigencia de Derechos") {
                curp = page[36].str;
                estado = page[28].str;
                nombre = page[35].str;
                data = { tipo: page[59].str, curp, estado, nombre }
                res.send(data);
            }
            else if (page[10].str == "Constancia de Semanas Cotizadas en el IMSS") {
                curp = page[16].str;
                estado = page[45].str;
                nombre = page[14].str;
                data = { tipo: page[10].str, curp, estado, nombre }
                res.send(data);
            }
            else if (page[60].str == "Asignación de Número de Seguridad Social") {
                curp = page[19].str;
                estado = page[18].str;
                nombre = page[13].str + " " + page[14].str + " " + page[15].str;
                data = { tipo: page[60].str, curp, estado, nombre }
                res.send(data);
            }
            else if (page[71].str == "CONSTANCIA DE NO INHABILITACIÓN") {
                estado = "CHIAPAS";
                nombre = page[88].str;
                curp = page[90].str;
                data = { tipo: page[71].str, curp, estado, nombre }
                res.json(data);
            }
            else if (page[5].str == "Registro Federal de Contribuyentes") {
                let Arreglo = [];
                for (let i = 0; i < page.length; i++) {
                    Arreglo.push(page[i].str)
                }
                let curpIndex = Arreglo.findIndex(function finder(data) { return data === 'CURP:' });
                const curp = Arreglo[curpIndex + 2];
                let nombreIndex = Arreglo.findIndex(function finder(data) { return data === 'Nombre (s):' });
                let matIndex = Arreglo.findIndex(function finder(data) { return data === 'Primer Apellido:' });
                let patIndex = Arreglo.findIndex(function finder(data) { return data === 'Segundo Apellido:' });
                const nombre = `${Arreglo[nombreIndex + 2]} ${Arreglo[matIndex + 2]} ${Arreglo[patIndex + 2]}`;
                let estadoIndex = Arreglo.findIndex(function finder(data) { return data === 'Nombre de la Entidad Federativa:' });
                const estado = Arreglo[estadoIndex + 2];
                data = { tipo: page[5].str, curp, estado, nombre };
                res.json(data);
            }
            else {

                if (paginaString.includes("Acta de Nacimiento")) {
                    let curpIndex = paginaString.findIndex(function finder(data) { return data === "Clave Única de Registro de Población" });
                    curp = paginaString[curpIndex + 2];
                    let stateIndex = paginaString.findIndex(function finder(data) { return data === "LUGAR DE REGISTRO" });
                    estado = paginaString[stateIndex + 2];
                    let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                    nombre = paginaString[personaregistrada + 1]
                    apellidos = paginaString[personaregistrada + 3] + " " + paginaString[personaregistrada + 5]
                    data = { tipo, curp, estado, nombre, apellidos }
                    res.send(data);
                }
                else if(paginaString.includes("Acta de Defunción")){
                    let curpIndex = paginaString.findIndex(function finder(data) { return data === "Clave Única de Registro de Población" });
                    curp = paginaString[curpIndex + 2];
                    let stateIndex = paginaString.findIndex(function finder(data) { return data === "Entidad de Registro" });
                    estado = paginaString[stateIndex - 2];
                    let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Fallecida:" });
                    nombre = paginaString[personaregistrada + 2]
                    apellidos = paginaString[personaregistrada + 4] + " " + paginaString[personaregistrada + 6]
                    data = { tipo: "Acta de Defunción", curp, estado, nombre, apellidos }
                    res.send(data);
                }
                else if(paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == false){
                    curp = paginaString[paginaString.length - 7];
                    nombreFull = paginaString[paginaString.length - 6];
                    nombre = nombreFull.split(' ')[0] +" "+ nombreFull.split(' ')[1];
                    apellidos = nombreFull.split(' ')[2] +" "+ nombreFull.split(' ')[3];
                    estado = paginaString[paginaString.length - 14].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if(paginaString.includes("DE SUSPENSIÓN DE DESCUENTOS")){
                    curp = paginaString[paginaString.length - 6];
                    nombre = paginaString[paginaString.length - 11];
                    nombreFull = paginaString[paginaString.length - 1];
                    apellidos = nombreFull.split(' ')[nombreFull.split(' ').length-2] +" "+ nombreFull.split(' ')[nombreFull.split(' ').length-1];
                    nombre = nombreFull.split(' ')[0];
                    estado = paginaString[paginaString.length - 8].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if(paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == true){
                    curp = paginaString[paginaString.length - 36];
                    nombreFull = paginaString[paginaString.length - 34];
                    nombre = nombreFull.split(' ')[nombreFull.split(' ').length-1]
                    apellidos = nombreFull.split(' ')[0] +" "+ nombreFull.split(' ')[1];
                    estado = paginaString[paginaString.length - 18].split(' ')[0];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }

                else {
                    res.send(paginaString);
                    //res.status(406).send({ message: 'Actas/NSS Only!' });
                    
                }



            }

        }).catch(err => {
            res.status(500).json(err);
        });
    }
}

exports.loadActa = async (req, res) => {
    if (!req.body.price) {
        return res.status(500).send({ message: 'No data recived!' })
    }
    else {
        const { enterprise, provider, document, states, curp, nombreacta, requested, price, namefile } = req.body;
        try {
            const users = await Users.findOne({ where: { id: provider }, attributes: ['idSuper', 'precios'] });
            const super1 = await Users.findOne({ where: { id: users.idSuper }, attributes: ['idSuper', 'precios'] });

            let documento;
            switch (document) {
                case "Asignación de Número de Seguridad Social":
                    documento = "nss";
                    break;
                case "Acta de Defunción":
                    documento = "def";
                    break;
                case "Acta de Nacimiento":
                    documento = "nac";
                    break;
                case "Acta de Matrimonio":
                    documento = "mat";
                    break;
                case "Acta de Divorcio":
                    documento = "div";
                    break;
                case "Constancia de Vigencia de Derechos":
                    documento = "der";
                    break;
                case "Constancia de Semanas Cotizadas en el IMSS":
                    documento = "cot";
                    break;
                case "Registro Federal de Contribuyentes":
                    documento = "rfc";
                    break;
                case "CONSTANCIA DE NO INHABILITACIÓN":
                    documento = "inh";
                    break;
                case "AVISO PARA RETENCIÓN DE DESCUENTOS":
                    documento = "ret";
                    break;
                default:
                    documento = "";
                    break;
            }
            let state;

            switch (states) {
                case "CHIAPAS":
                    state = "chia";
                    break;
                case "BAJA CALIFORNIA SUR":
                    state = "bcs";
                    break;
                case "BAJA CALIFORNIA":
                    state = "bcn";
                    break;
                case "YUCATAN":
                    state = "yuca";
                    break;
                case "VERACRUZ":
                    state = "vera";
                    break;
                case "VERACRUZ DE IGNACIO DE LA":
                    state = "vera";
                    break;
                case "VERACRUZ DE IGNACIO DE LA LLAVE":
                    state = "vera";
                    break;
                case "COAHUILA":
                    state = "coah";
                    break;
                case "COAHUILA DE ZARAGOZA":
                    state = "coah";
                    break;
                case "MICHOACAN":
                    state = "mich";
                    break;
                case "MICHOACAN DE OCAMPO":
                    state = "mich";
                    break;
                case "TLAXCALA":
                    state = "tlax";
                    break;
                case "DURANGO":
                    state = "dura";
                    break;
                case "AGUASCALIENTES":
                    state = "agua";
                    break;
                case "HIDALGO":
                    state = "hida";
                    break;
                case "PUEBLA":
                    state = "pueb";
                    break;
                case "QUERETARO":
                    state = "quer";
                    break;
                case "CHIHUAHUA":
                    state = "chih";
                    break;
                case "OAXACA":
                    state = "oaxa";
                    break;
                case "SONORA":
                    state = "sono";
                    break;
                case "SAN LUIS POTOSI":
                    state = "slp";
                    break;
                case "SINALOA":
                    state = "sina";
                    break;
                case "GUERRERO":
                    state = "guer";
                    break;
                case "ZACATECAS":
                    state = "zaca";
                    break;
                case "TAMAULIPAS":
                    state = "tama";
                    break;
                case "MORELOS":
                    state = "more";
                    break;
                case "TABASCO":
                    state = "taba";
                    break;
                case "GUANAJUATO":
                    state = "guan";
                    break;
                case "COLIMA":
                    state = "coli";
                    break;
                case "JALISCO":
                    state = "jali";
                    break;
                case "CDMX":
                    state = "cdmx";
                    break;
                case "CAMPECHE":
                    state = "camp";
                    break;
                case "NUEVO LEON":
                    state = "nl";
                    break;
                case "MEXICO":
                    state = "mex";
                    break;
                case "CIUDAD DE MEXICO":
                    state = "mex";
                    break;
                case "QUINTANA ROO":
                    state = "qroo";
                    break;
                case "NAYARIT":
                    state = "naya";
                    break;
                default:
                    state = "";
                    break;
            }
            if (states.includes("ESTADOS")) {
                state = "ext"
            }
            let precioSu1Flat = 0;
            try {
                precioSu1Flat = users.precios[documento]
                if (JSON.stringify(precioSu1Flat).length > 1 && documento == "nac") {
                    precioSu1Flat = precioSu1Flat[state]
                }
            } catch {
                precioSu1Flat = 0
            }

            let precioSu2Flat = 0;
            try {
                precioSu2Flat = super1.precios[documento]
                
                if (JSON.stringify(precioSu2Flat).length > 1 && documento == "nac") {
                    precioSu2Flat = precioSu2Flat[state]
                    
                }
            } catch {
                precioSu2Flat = 0
            }


            
            let newActa = await Actas.create({
                enterprise,
                provider,
                document,
                states,
                curp,
                nombreacta,
                requested,
                idcreated: req.usuarioID,
                price,
                hidden: false,
                idsup1: users.idSuper,
                preciosup1: precioSu1Flat,
                idsup2: super1.idSuper,
                preciosup2: precioSu2Flat,
                namefile
            },
                { field: ['enterprise', 'provider', 'document', 'states', 'curp', 'nombreacta', 'requested', 'idcreated', 'price', 'hidden', 'idsup1', 'preciosup1', 'idsup2', 'preciosup2', 'namefile'] });
            if (newActa) {
                res.status(201).json({ message: 'Acta Added!' });
            }
        } catch (error) {
           res.status(500).json(error);
        }
    }

}

exports.getMyDatesCuts = async (req, res) => {
    const { id } = req.params;
    const data = await Actas.findAll({ where: { enterprise: id }, group: ['corte'], attributes: ['corte'] });
    if (data.length != 0) {
        return res.status(200).json(data);
    }
    else {
        return res.status(404).json({
            message: 'No found'
        })
    }
}

exports.getCorteDate = async (req, res) => {
    const { id, date } = req.params;
    if (date == "null") {
        await Actas.findAll({ where: { enterprise: id, corte: { [Op.is]: null } }, order: [['createdAt', 'ASC']] }).then(data => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
    else {
        await Actas.findAll({ where: { enterprise: id, corte: date }, order: [['cratedAt', 'ASC']] }).then(data => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
}

exports.getCorte = async (req, res) => {
    const { id, date } = req.params;
    const idToken = req.usuarioID;
    const myData = await Users.findOne({ where: { id }, attributes: ["rol"] });


    if (date == "null") {
        await Actas.findAll({ where: { hidden: null || false, [Op.or]: [{ enterprise: id }, { provider: id }, { idsup1: id }, { idsup2: id }], corte: { [Op.is]: null } }, order: [['createdAt', 'ASC']] }).then(data => {
            let dataFull = []
            for (let i = 0; i < data.length; i++) {
                let precio;
                if (idToken == data[i].provider) {
                    precio = data[i].price
                }
                else if (idToken == data[i].idsup1) {
                    precio = data[i].preciosup1
                }
                else if (idToken == data[i].idsup2) {
                    precio = data[i].preciosup2
                }
                arreglo = { "document": data[i].document, "createdAt": data[i].createdAt, "states": data[i].states, "nombreacta": data[i].nombreacta, "curp": data[i].curp, "price": precio }
                dataFull.push(arreglo);
            }
            return res.status(200).json(dataFull);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
    else {

        await Actas.findAll({ where: { hidden: null || false, [Op.or]: [{ enterprise: id }, { provider: id }, { idsup1: id }, { idsup2: id }], corte: date }, order: [['createdAt', 'ASC']] }).then(data => {
            let dataFull = []
            for (let i = 0; i < data.length; i++) {
                let precio;
                if (idToken == data[i].provider) {
                    precio = data[i].price
                }
                else if (idToken == data[i].idsup1) {
                    precio = data[i].preciosup1
                }
                else if (idToken == data[i].idsup2) {
                    precio = data[i].preciosup2
                }
                arreglo = {
                    "document": data[i].document,
                    "createdAt": data[i].createdAt,
                    "states": data[i].states,
                    "nombreacta": data[i].nombreacta,
                    "curp": data[i].curp, "price": precio
                }
                dataFull.push(arreglo);
            }
            return res.status(200).json(dataFull);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
}

exports.getMyCorte = async (req, res) => {
    const id = req.params.id;

    if (id == "1") {
        const actas = await Actas.findAll({ where: { hidden: false }, order: [['id', 'ASC']] });
        const usuarios = await Users.findAll({ attributes: ['id', 'nombre'] });
        let data = [];
        let current = 0;
        for (let i = 0; i < actas.length; i++) {

            var currentUser = usuarios.find(element => {
                return element["id"] == Number(actas[i].provider);
            });
            var currentProvider = usuarios.find(element => {
                return element["id"] == Number(actas[i].enterprise);
            });

            var currentUploader = usuarios.find(element => {
                return element["id"] == Number(actas[i].idcreated);
            });

            var nombreUploader = ""
            try {
                nombreUploader = currentUploader.nombre;
            } catch (error) {
                nombreUploader = "Usuario Eliminado";
            }

            current++;
            try{
                data.push({
                    "i": current,
                    "id": actas[i].id,
                    "document": actas[i].document,
                    "curp": actas[i].curp,
                    "states": actas[i].states,
                    "nombreacta": actas[i].nombreacta,
                    "provider": currentProvider.nombre,
                    "enterprise": currentUser.nombre,
                    "createdAt": actas[i].createdAt,
                    "price": actas[i].price,
                    "uploadBy": nombreUploader
                });
            }
            catch{
                data.push({
                    "i": current,
                    "id": actas[i].id,
                    "document": actas[i].document,
                    "curp": actas[i].curp,
                    "states": actas[i].states,
                    "nombreacta": actas[i].nombreacta,
                    "provider": "Usuario Eliminado",
                    "enterprise": currentUser.nombre,
                    "createdAt": actas[i].createdAt,
                    "price": actas[i].price,
                    "uploadBy": nombreUploader
                });
            }
            
            

        }
        res.status(200).json(data);

    }
    else {
        const actas = await Actas.findAll({ where: { hidden: null || false, [Op.or]: [{ idcreated: id }, { provider: id }, { idsup1: id }, { idsup2: id }] }, order: [['id', 'ASC']] });
        const usuarios = await Users.findAll({ attributes: ['id', 'nombre'] });
        let data = []
        let current = 0;
        for (let i = 0; i < actas.length; i++) {


            var currentUser = usuarios.find(element => {
                return element["id"] == Number(actas[i].provider);
            });
            var currentProvider = usuarios.find(element => {
                return element["id"] == Number(actas[i].enterprise);
            });
            var superVisor;
            if (actas[i].idsup1 == null) {
                superVisor = "";
            }
            else {
                superVisor = usuarios.find(element => {
                    return element["id"] == Number(actas[i].idsup1);
                })
            }

            var currentUploader = usuarios.find(element => {
                return element["id"] == Number(actas[i].idcreated);
            });

            var nombreUploader = ""
            try {
                nombreUploader = currentUploader.nombre;
            } catch (error) {
                nombreUploader = "Usuario Eliminado";
            }


            current++;
            data.push({
                "i": current,
                "id": actas[i].id,
                "document": actas[i].document,
                "curp": actas[i].curp,
                "states": actas[i].states,
                "nombreacta": actas[i].nombreacta,
                "provider": currentProvider.nombre,
                "enterprise": currentUser.nombre,
                "createdAt": actas[i].createdAt,
                "price": actas[i].price,
                "pay2": superVisor.nombre,
                "buy": actas[i].preciosup1,
                "uploadBy": nombreUploader
            });
        }
        res.status(200).json(data);
    }

}

exports.getCorteForOne = async (req, res) => {
    const { id } = req.params;
    await Actas.findAll({ where: { enterprise: id }, order: [['id', 'ASC']] }).then(data => {
        if (data.length != 0) {
            res.status(200).json(data);
        }
        else {
            res.status(404).json({ message: "No found" });
        }
    }).catch(err => {
        res.status(500).json({ message: "Internal error!" });
    });


}

exports.countMyActasEnterprise = async (req, res) => {
    const { id } = req.params;
    data = {};
    //Nac
    const nac = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Acta de Nacimiento' } });
    data.nac = nac['count'];
    //Mat
    const mat = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Acta de Matrimonio' } });
    data.mat = mat['count'];
    //Div
    const div = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Acta de Divorcio' } });
    data.div = div['count'];
    //Def
    const def = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Acta de Defunción' } });
    data.def = def['count'];
    //RFC
    const rfc = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Registro Federal de Contribuyentes' } });
    data.rfc = rfc['count'];
    //Cot
    const cot = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Constancia de Semanas Cotizadas en el IMSS' } });
    data.cot = cot['count'];
    //Der
    const der = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Constancia de Vigencia de Derechos' } });
    data.der = der['count'];
    //INH
    const inh = await Actas.findAndCountAll({ where: { enterprise: id, document: 'CONSTANCIA DE NO INHABILITACIÓN' } });
    data.inh = inh['count'];
    //NSS
    const nss = await Actas.findAndCountAll({ where: { enterprise: id, document: 'Asignación de Número de Seguridad Social' } });
    data.nss = nss['count'];
    data.total = data.nac + data.mat + data.div + data.def + data.rfc + data.cot + data.der + data.inh + data.nss;
    res.json(data);
}

exports.clientsCurrent = async (req, res) => {
    const id = JSON.stringify(req.usuarioID);

    const data = [];
    const enterprisesId = await Actas.findAll({ where: { provider: id }, attributes: ['enterprise'], group: ['enterprise'] });

    for (let i = 0; i < enterprisesId.length; i++) {
        var enterprisesName = await Users.findOne({ where: { id: enterprisesId[i]["enterprise"] }, attributes: ['nombre'] });
        data.push({ "id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"] })
    }

    if (data.length != 0) {
        res.status(200).json(data);
    }
    else {
        res.status(404).json({ message: "No found!" })
    }



}

exports.getMyDocumentsUploaded = async (req, res) => {
    const { id } = req.params;
    const actas = await Actas.findAll({ where: { idcreated: id } });
    if (actas.length != 0) {
        return res.status(200).json(actas);
    }
    else {
        return res.status(404).json({
            message: 'Actas no found!'
        })
    }

}

exports.deleteActa = async (req, res) => {
    const rol = req.usuarioRol;
    if (rol == "") {
        res.status(401).json({
            message: "Don't have auth"
        });
    }
    else {
        const { id } = req.params;
        await Actas.destroy({
            where: { id }
        }).then(data => {
            if (data == 0) {
                return res.status(404).json({
                    message: 'Acta dont found'
                });
            }
            else {
                return res.status(200).json({
                    message: 'Acta deleted'
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

exports.documentsLevel = async (req, res) => {
    const id = JSON.stringify(req.usuarioID);
    const { level } = req.params;
    const data = [];

    if (level == "0") {
        const enterprisesId = await Actas.findAll({ where: { provider: id }, attributes: ['enterprise'], group: ['enterprise'] });

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({ where: { id: enterprisesId[i]["enterprise"] }, attributes: ['nombre'] });
            data.push({ "id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"] })
        }

        if (data.length != 0) {
            return res.status(200).json(data);
        }
        else {
            return res.status(404).json({ message: "No found!" })
        }
    }

    else if (level == "1") {
        const enterprisesId = await Actas.findAll({ where: { idsup1: id }, attributes: ['enterprise'], group: ['enterprise'], });

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({ where: { id: enterprisesId[i]["enterprise"] }, attributes: ['nombre'] });
            data.push({ "id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"] })
        }

        if (data.length != 0) {
            return res.status(200).json(data);
        }
        else {
            return res.status(404).json({ message: "No found!" })
        }
    }
    else if (level == "2") {
        const enterprisesId = await Actas.findAll({ where: { idsup2: id }, attributes: ['enterprise'], group: ['enterprise'], });

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({ where: { id: enterprisesId[i]["enterprise"] }, attributes: ['nombre'] });
            data.push({ "id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"] })
        }

        if (data.length != 0) {
            return res.status(200).json(data);
        }
        else {
            return res.status(404).json({ message: "No found!" })
        }
    }
    else {
        res.status(404).json({
            message: 'No found'
        })
    }

}

exports.lowerToCut = async (req, res) => {
    const id = req.usuarioID;
    const idLower = await Users.findAll({ where: { idSuper: id }, attributes: ['id', 'nombre'], group: ['id'] });
    if (idLower.length != 0) {
        const data = [];
        for (let i = 0; i < idLower.length; i++) {
            const idCurrent = JSON.stringify(idLower[i].id)
            var profile = await Actas.findOne({ where: { [Op.or]: [{ idsup2: idCurrent }, { idsup1: idCurrent }, { provider: idCurrent }, { enterprise: idCurrent }] } })
            if (profile != null) {
                data.push({ "id": idCurrent, "nombre": idLower[i].nombre })
            }
        }
        if (data) {
            res.status(200).json(data);
        }
    }
    else {
        res.status(404).json({ message: 'No found' })
    }
}

exports.historialDate = async (req, res) => {
    const { id } = req.params;
    const data = await Actas.findAll({ where: { [Op.or]: [{ provider: id }, { enterprise: id }, { idsup1: id }, { idsup2: id }] }, group: ['corte'], attributes: ['corte'] });
    if (data.length != 0) {
        return res.status(200).json(data);
    }
    else {
        return res.status(404).json({
            message: 'No found'
        })
    }

}

exports.getDontSend = async (req, res) => {
    const id = req.usuarioID;
    const idLower = await Users.findAll({ where: { idSuper: id }, attributes: ['id', 'nombre'], group: ['id'] });
    if (idLower.length != 0) {
        const data = [];
        for (let i = 0; i < idLower.length; i++) {
            const idCurrent = JSON.stringify(idLower[i].id)
            var profile = await Actas.findOne({ where: { [Op.or]: [{ idsup2: idCurrent }, { idsup1: idCurrent }, { provider: idCurrent }, { enterprise: idCurrent }], send: false } })
            if (profile != null) {
                data.push({ "id": idCurrent, "nombre": idLower[i].nombre })
            }
        }
        if (data) {
            res.status(200).json(data);
        }
    }
    else {
        res.status(404).json({ message: 'No found' });
    }
}

exports.getReadySend = async (req, res) => {
    const id = req.usuarioID;
    const idLower = await Users.findAll({ where: { idSuper: id }, attributes: ['id', 'nombre'], group: ['id'] });
    if (idLower.length != 0) {
        const data = [];
        for (let i = 0; i < idLower.length; i++) {
            const idCurrent = JSON.stringify(idLower[i].id)
            var profile = await Actas.findOne({ where: { [Op.or]: [{ idsup2: idCurrent }, { idsup1: idCurrent }, { provider: idCurrent }, { enterprise: idCurrent }], send: true } })
            if (profile != null) {
                data.push({ "id": idCurrent, "nombre": idLower[i].nombre })
            }
        }
        if (data) {
            res.status(200).json(data);
        }
    }
    else {
        res.status(404).json({ message: 'No found' });
    }
}

exports.setSend = async (req, res) => {
    const { id } = req.params;
    const { date, send } = req.body;
    res.send(date);
    // await Actas.update({ send }, { where: { corte: date, [Op.or]: [{ provider: id }, { enterprise: id }, { idsup1: id }, { idsup2: id }] } }).then(data => {
    //     if (data != 0) {
    //         return res.status(200).json({ message: 'Updated!' });
    //     }
    //     else {
    //         return res.status(404).json({ message: 'No found!' });
    //     }
    // }).catch(err => {
    //     res.status(500).json({ message: 'Internal Error!' });
    // });
}

exports.changeDate = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    if (req.usuarioRol != "Cliente" && req.usuarioRol != "Capturista") {
        await Actas.update({ createdAt: date }, { where: { id } }).then(data => {
            if (data != 0) {
                return res.status(200).json({ message: 'Updated!' });
            }
            else {
                return res.status(404).json({ message: 'No found!' });
            }
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
    else {
        return res.status(500).json({ message: 'Dont have auth!' })
    }

}

exports.moveToTrash = async (req, res) => {
    const Userid = req.usuarioID;
    const { id, hidden } = req.body;

    await Actas.update({ hidden, idhidden: Userid }, { where: { id } }).then(data => {
        if (data != 0) {
            return res.status(200).json({ message: 'Updated!' });
        }
        else {
            return res.status(404).json({ message: 'No found!' });
        }
    }).catch(err => {
        return res.status(500).json(err);
    });

}

exports.getTrash = async (req, res) => {
    const id = req.usuarioID;

    if (id == 1) {

        const actas = await Actas.findAll({ where: { hidden: true }, order: [['id', 'ASC']] });
        const usuarios = await Users.findAll({ attributes: ['id', 'nombre'] });
        let data = [];
        let current = 0;
        for (let i = 0; i < actas.length; i++) {

            var currentUser = usuarios.find(element => {
                return element["id"] == Number(actas[i].provider);
            });
            var currentProvider = usuarios.find(element => {
                return element["id"] == Number(actas[i].enterprise);
            });
            var nombreCulpable = usuarios.find(element => {
                return element["id"] == Number(actas[i].idhidden);
            });

            current++;
            try{

                
                data.push({
                    "i": current,
                    "id": actas[i].id,
                    "document": actas[i].document,
                    "curp": actas[i].curp,
                    "states": actas[i].states,
                    "nombreacta": actas[i].nombreacta,
                    "provider": currentProvider.nombre,
                    "enterprise": currentUser.nombre,
                    "createdAt": actas[i].createdAt,
                    "price": actas[i].price,
                    "culpable": nombreCulpable
                });
            }
            catch{
                data.push({
                    "i": current,
                    "id": actas[i].id,
                    "document": actas[i].document,
                    "curp": actas[i].curp,
                    "states": actas[i].states,
                    "nombreacta": actas[i].nombreacta,
                    "provider": "Usuario Eliminado",
                    "enterprise": "Usuario Eliminado",
                    "createdAt": actas[i].createdAt,
                    "price": actas[i].price,
                    "culpable": nombreCulpable
                });
            }
            

        }
        res.status(200).json(data);




    }
    else{
        res.status(404).json({message: 'Dont have auth!'})
    }

}

/// C O R T E ////

exports.getAllDates = async (req, res) => {
    await Actas.findAll({ group: ['corte'], attributes: ['corte'], order: [['corte', 'DESC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getUsersByDate = async (req, res) => {
    const id = JSON.stringify(req.usuarioID);
    const { date } = req.params;

    var fecha;
    if (date == "null") {
        fecha = null;
    }
    else {
        fecha = date;
    }

    const idLows = await Users.findAll({ where: { idSuper: id }, attributes: ['id', 'username', 'nombre'], order: [['id', 'ASC']] });

    let currents = [];
    for (let i = 0; i < idLows.length; i++) {
        actasCurrent = await Actas.findOne({
            where: {
                corte: fecha, hidden: false,
                [Op.or]: [{ enterprise: JSON.stringify(idLows[i].id) }, { provider: JSON.stringify(idLows[i].id) }, { idsup1: JSON.stringify(idLows[i].id) }, { idsup2: JSON.stringify(idLows[i].id) }]
            },
            attributes: ['provider', 'idsup1', 'idsup2']
        });
        if (actasCurrent != null) {
            currents.push(idLows[i]);
        }
    }

    res.status(200).json(currents);
}


exports.getRegistersAt = async (req, res) => {
    const id = req.usuarioID;
    const { date } = req.params;

    const usuarios = await Users.findAll({ attributes: ['id', 'username', 'nombre']});
    var datos = [];



    if(date != "null"){
        datos = await Actas.findAll({where: {
            [Op.or]: [{ provider: JSON.stringify(id) }, {idsup1: id }, {idsup2: id }],
            corte: date, hidden: false
        }, order: ['createdAt','id']});
    }
    else{
        datos = await Actas.findAll({where: {
            [Op.or]: [{ provider: JSON.stringify(id) }, {idsup1: id }, {idsup2: id }],
            corte: {[Op.eq]: null} , hidden: false
        }, order: ['createdAt','id']});
    }
    

    if(datos.length > 0){
        let dataToSend = [];
        for (let i = 0; i < datos.length; i++) {
            let empresa = usuarios.find(element => {
                return element["id"] == Number(datos[i].enterprise);
            })
            let proveedor = usuarios.find(element => {
                return element["id"] == Number(datos[i].provider);
            })
            var precio = 0;
            var costo = 0;
            var pagarA = "";


            
            if(datos[i].provider == id){
                precio = datos[i].price;
                costo = datos[i].preciosup1;
                try {
                    var pay2 = usuarios.find(element => {
                        return element["id"] == Number(datos[i].idsup1);
                    });
                    pagarA = pay2.nombre;
                } catch (error) {
                    pagarA = "";
                }
                
            }
            else if(datos[i].idsup1 == id){
                precio = datos[i].preciosup1;
                costo = datos[i].preciosup2;
                try {
                    var pay2 = usuarios.find(element => {
                        return element["id"] == Number(datos[i].idsup2);
                    });
                    pagarA = pay2.nombre;
                } catch (error) {
                    pagarA = "";
                }
                
            }
            else if(datos[i].idsup2 == id){
                precio = datos[i].preciosup2;
                costo = 0;
                pagarA = "";
            }



            dataToSend.push({
                "id": datos[i].id,
                "enterprise": empresa.nombre,
                "curp": datos[i].curp,
                "states": datos[i].states,
                "provider": proveedor.nombre,
                "document": datos[i].document,
                "price": precio,
                "buy": costo,
                "pay2": pagarA,
                "createdAt": datos[i].createdAt,
                "corte": datos[i].corte
            });
        }
    
    
        return res.json(dataToSend);
    }
    else{
        return res.status(404).json({message: 'No found!'})
    }
    
}
