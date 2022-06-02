module.exports = (sequelize, Sequelize) => {
    const notifications = sequelize.define("notifications", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            type: Sequelize.TEXT
        },
        id_req: {
            type: Sequelize.INTEGER
        },
        view: {
            type: Sequelize.BOOLEAN
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    }, {freezeTableName: true});

    return notifications;

}