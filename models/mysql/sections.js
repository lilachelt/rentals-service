'use strict';

module.exports = (sequelize, DataTypes) => {
  const sections = sequelize.define('sections', {
      name: DataTypes.STRING(255),
  }, {});
  sections.associate = (models) => {
    // associations can be defined here
   
  };
  return sections;
};