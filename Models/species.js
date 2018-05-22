/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('species', {
    id_specie: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name_specie: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    super_zone: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    zone: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
  }, {
    tableName: 'species'
  });
};
