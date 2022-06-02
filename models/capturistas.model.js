module.exports = (sequelize, Sequelize) => {
    const Capturistas = sequelize.define("capturistas", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario: {
            type: Sequelize.TEXT
        },
        password: {
            type: Sequelize.TEXT
        },
        avatar: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        telefono: {
            type: Sequelize.TEXT
        },
        estado: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.BOOLEAN
        }



    }, {freezeTableName: true});

    return Capturistas;
}