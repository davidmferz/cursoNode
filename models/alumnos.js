const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize) => {
  const Alumnos = Sequelize.define(
    "Alumnos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
      },
      ap1: {
        type: DataTypes.STRING,
      },
      ap2: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      esActivo: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: false, // Desactivar los timestamps automáticos
    }
  );

  return Alumnos;
};
