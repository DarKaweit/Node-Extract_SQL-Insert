/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fishing', {
    id_fishing: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_specie: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    value_landing: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    value_quota: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'fishing'
  });
};
