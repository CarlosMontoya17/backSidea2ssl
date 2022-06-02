module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.TEXT
        },
        password: {
            type: Sequelize.TEXT
        },
        rol: {
            type: Sequelize.TEXT
        },
        type: {
            type: Sequelize.TEXT
        },
        idSuper: {
            type: Sequelize.DOUBLE
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        precios: {
            type: Sequelize.JSON
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        nombre: {
            type: Sequelize.TEXT
        },
        promocion: {
            type: Sequelize.JSON
        }
    }, { freezeTableName: true });
    return Users;
}