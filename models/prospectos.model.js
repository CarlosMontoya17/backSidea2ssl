module.exports = (sequelize, Sequelize) => {
    const Prospectos = sequelize.define("prospectos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fechacontacto: {
            type: Sequelize.DATE
        },
        nombre: {
            type: Sequelize.TEXT
        },
        apellido: {
            type: Sequelize.TEXT
        },
        contacto: {
            type: Sequelize.TEXT
        },
        movil: {
            type: Sequelize.TEXT
        },
        nombrefacebook: {
            type: Sequelize.TEXT
        },
        linkperfil: {
            type: Sequelize.TEXT
        },
        celularbandeja: {
            type: Sequelize.TEXT
        },
        correobandeja: {
            type: Sequelize.TEXT
        },
        cuidaddondevive: {
            type: Sequelize.TEXT
        },
        tipodenegocio: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.TEXT
        },
        comentarios: {
            type: Sequelize.TEXT
        },
        notas: {
            type: Sequelize.TEXT
        },
        referidopor: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        }
    });
    return Prospectos;
}