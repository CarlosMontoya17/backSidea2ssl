const cnfg = require("../config/db.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    cnfg.DB,
    cnfg.USER,
    cnfg.PASSWORD,
    {
        host: cnfg.HOST,
        dialect: cnfg.DIALECT,
        pool: {
            max: cnfg.pool.max,
            min: cnfg.pool.min,
            acquire: cnfg.pool.acquire,
            idle: cnfg.pool.idle
        },
        logging: false
    }
);
const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.Users = require("./users.model")(sequelize,Sequelize);
database.Capturistas = require("./capturistas.model")(sequelize,Sequelize);
database.Actas = require("./actas.model")(sequelize,Sequelize);
database.Actas_req = require("./actas_req.model")(sequelize, Sequelize);
database.Prospectos = require("./prospectos.model")(sequelize, Sequelize);
database.Publicidad = require("./publicidad.model")(sequelize, Sequelize);
database.Notifications = require("./notifications.model")(sequelize, Sequelize);
database.Actas_reg = require("./actas_reg.model")(sequelize, Sequelize);
module.exports = database;