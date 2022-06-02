module.exports = (sequelize, Sequelize) => {
    const actas_req = sequelize.define("actas_req", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.TEXT
        },
        metadata: {
            type: Sequelize.JSON
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        id_req: {
            type: Sequelize.INTEGER
        },
        send: {
            type: Sequelize.BOOLEAN
        },
        comments: {
            type: Sequelize.TEXT
        },
        url: {
            type: Sequelize.TEXT
        },
        preferences: {
            type: Sequelize.TEXT
        },
        corte:{ 
            type: Sequelize.DATE
        },
        ip_req: {
            type: Sequelize.TEXT
        }

    }, {freezeTableName: true});

    return actas_req;

}