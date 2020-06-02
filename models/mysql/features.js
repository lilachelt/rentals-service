'use strict';

module.exports = (sequelize, DataTypes) => {
  const features = sequelize.define('features', {
    feature_name: DataTypes.STRING(255)
  }, {});
  features.associate = (models) => {
    //features.belongsTo(Apartment_feature, {foreignKey: 'id'});
    // associations can be defined here
  };
  return features;
};