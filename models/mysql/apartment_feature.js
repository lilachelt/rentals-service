'use strict';

module.exports = (sequelize, DataTypes) => {
  const apartment_feature = sequelize.define('apartment_feature', {
    apartment_id: DataTypes.STRING(45),
    feature_id: DataTypes.STRING(45)
  }, {});
  apartment_feature.associate = (models) => {
    // associations can be defined here
   
  };
  return apartment_feature;
};