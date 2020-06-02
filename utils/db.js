const db = require('../models/mysql/index')

const apartments = db.apartments;
const features= db.features;
const apartment_feature = db.apartment_feature
const sections = db.sections;
const media = db.media;

db.features.hasMany(db.apartment_feature, {foreignKey: 'feature_id'})
db.apartment_feature.belongsTo(db.features, {foreignKey: 'feature_id'})

db.apartments.hasMany(db.apartment_feature, {foreignKey: 'apartment_id'})
db.apartment_feature.belongsTo(db.apartments, {foreignKey: 'apartment_id'})

db.sections.hasMany(db.media, {foreignKey: 'section_id'})
db.media.belongsTo(db.sections, {foreignKey: 'section_id'})

db.apartments.hasMany(db.media, {foreignKey: 'meta_value'})
db.media.belongsTo(db.apartments, {foreignKey: 'meta_value'})

module.exports = { 
    db,
    apartments,
    features,
    apartment_feature,
    sections,
    media
}
