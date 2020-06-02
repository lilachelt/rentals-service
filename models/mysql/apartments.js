'use strict';
module.exports = (sequelize, DataTypes) => {
  const apartments = sequelize.define('apartments', {
    city: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
    price: DataTypes.STRING(255),
    rooms: DataTypes.STRING(255), 
    enabeld: {type: DataTypes.BIGINT,allowNull: false},
  }, { timestamps : false});
  apartments.associate = function(models) {
    // associations can be defined here
  };
  return apartments;
};

//TODO defult value to enabled