module.exports = (sequelize, Sequelize) => {
    const publicidad = sequelize.define("publicidad", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_archivo: {
            type: Sequelize.TEXT
        },
        tipo:{
            type: Sequelize.TEXT
        },
        id_quien:{
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt:{
            type: Sequelize.DATE
        }
    }, {freezeTableName: true});

    return publicidad;
}