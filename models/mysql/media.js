'use strict';

module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define('media', {
    section_id: DataTypes.STRING(45),
    files_ids: DataTypes.STRING(255),
    meta_key: DataTypes.STRING(255),
    meta_value: DataTypes.STRING(45),
  }, {});
  media.associate = (models) => {
    // associations can be defined here
   
  };
  return media;
};