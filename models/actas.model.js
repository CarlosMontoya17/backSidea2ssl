module.exports = (sequelize, Sequelize) => {
    const actas = sequelize.define("actas", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enterprise: {
            type: Sequelize.TEXT
        },
        provider: {
            type: Sequelize.TEXT
        },
        document: {
            type: Sequelize.TEXT
        },
        states: {
            type: Sequelize.TEXT
        },
        curp: {
            type: Sequelize.TEXT
        },
        nombreacta: {
            type: Sequelize.TEXT
        },
        requested: {
            type: Sequelize.TEXT
        },
        idcreated: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        price: {
            type: Sequelize.DOUBLE
        },
        corte: {
            type: Sequelize.TEXT
        },
        hidden: {
            type: Sequelize.BOOLEAN
        },
        idsup1: {
            type: Sequelize.INTEGER
        },
        preciosup1:{
            type: Sequelize.DOUBLE
        },
        idsup2: {
            type: Sequelize.INTEGER
        },
        preciosup2: {
            type: Sequelize.DOUBLE
        },
        namefile: {
            type: Sequelize.TEXT
        },
        send: {
            type: Sequelize.BOOLEAN
        },
        idhidden: {
            type: Sequelize.DOUBLE
        }
    }, {freezeTableName:true});
    return actas;
}