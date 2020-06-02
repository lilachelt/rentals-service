const db = require ('../utils/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
config_data = require('../config/config.json');

const getApartments = (req,res) => {
    const city = req.query.city?req.query.city:"";
    const address = req.query.address?req.query.address:"";
    const minPrice = req.query.minPrice?req.query.minPrice:1;
    const maxPrice = req.query.maxPrice?req.query.maxPrice:100000;
    const minRooms = req.query.minRooms?req.query.minRooms:1;
    const maxRooms = req.query.maxRooms?req.query.maxRooms:20;

    db.apartments.findAll({
         where:{
            enabeld:1,
            city: {[Op.like]: city + '%'},
            address: {[Op.like]: address + '%'},
            price:{[Op.and]: 
                [
                    {[Op.gte]: minPrice},
                    {[Op.lte]: maxPrice}
                ]

            },
            rooms:{[Op.and]: 
                [
                    {[Op.gte]: minRooms},
                    {[Op.lte]: maxRooms}
                ]
            }
        },
        order:[['city', 'ASC']],
        include : [
            { 
                model: db.apartment_feature,
                attributes:['feature_id'],
                include:[
                            {
                              model: db.features,
                              attributes:['feature_name'],                                
                            }
                        ]
            },
            {
                model: db.media,
            }  
        ]                           
    })
    .then((apartments) => {
        arrResultObjects = [];
        apartments.map(async (apartment) =>{
            let filesIdsArr = [];
            featuresArr =  apartment.apartment_features;
            let featuresApartment = [];
            if (featuresArr){
                featuresArr.map(feature =>{
                    if(feature.feature){
                        featuresApartment.push(
                            {id:feature.feature_id,feature_name:feature.feature.feature_name}
                        )
                    }
                   })
            }
            if (apartment.media.length > 0){
                filesIdsArr = apartment.media[0].files_ids.split(",");
            }
            resObj = Object.assign(
                {},
                {
                 id:apartment.id,
                 city:apartment.city,
                 address:apartment.address,
                 price: apartment.price,
                 rooms: apartment.rooms,
                 enabeld: apartment.enabeld,
                 features:featuresApartment,
                 files:filesIdsArr
                });
                arrResultObjects.push(resObj);
        })
        res.json(arrResultObjects);
    }).catch(err => res.status(500).send(err));

}

const getApartmentById= (req,res) => {
    try{
    db.apartments.findOne({
                            where : {id:req.params.id},
                            order:[['city', 'ASC']],
                            include : [
                                { 
                                    model: db.apartment_feature,
                                    attributes:['feature_id'],
                                    include:[
                                                {
                                                  model: db.features,
                                                  attributes:['feature_name'],                                
                                                }
                                            ]
                                } 
                            ]  
                         })
        .then((apartmentById)=>{
            featuresArr =  apartmentById.apartment_features;
            featuresApartment = [];
            if (featuresArr){
                featuresArr.map(feature =>{
                    if(feature.feature){
                        featuresApartment.push(Number(feature.feature_id))
                    }
                })
            }
            resObj = Object.assign(
                {},
                {
                 id:apartmentById.id,
                 city:apartmentById.city,
                 address:apartmentById.address,
                 price: apartmentById.price,
                 rooms: apartmentById.rooms,
                 enabeld: apartmentById.enabeld,
                 features:featuresApartment,
                 files:[],
                });
            res.json(resObj);
    })
    }catch(err){
        res.send(err);
    }
}  

const getFeatures = (req,res) =>{
    try{
        db.features.findAll()
        .then((features) => {
          res.json(features);
        })
    }catch(err){
        res.status(500).send(err)
    }
}

const findBySectionName= async (section) => {
    try{
        return await db.sections.findOne({name:section});
    }catch(err){
        throw err;
    }
}

const createImagesRows = async (req, res) => {
    try{
            const section  = await findBySectionName(req.body.sectionName);
            const media = await db.media.create({
                section_id:section.id,
                files_ids:req.body.arrImagesIds.join(','),
                meta_key:req.body.metaKey,
                meta_value:req.body.metaValue,
            })
            res.json(media)
    }catch(err){
        res.status(500).send(err);
    }
}

const createFeaturesRows = (features,apartment_id) =>{
    try{
        features.map ( feature => {
            db.apartment_feature.create({
                apartment_id: apartment_id,
                feature_id: feature
            })
        })
        return;
    }catch(err){
        throw err;
    }
    
}

const createApartment = async (req,res) => {
    try{
        const apartment = await db.apartments.create(req.body)
            if (apartment){
                //insert features apartment to DB
                let {features} = req.body; 
                if (!Array.isArray(features)){
                    featuresStr = features.replace(",", "");
                    features = Array.from(featuresStr);
                }
                const res =createFeaturesRows(features, apartment.id);
            }
            res.json(apartment);
    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//delete means - set enable flag to 0
//TODO - remove media rows
const removeApartment = (req,res) => {
    try{
        db.apartments.update(
            {enabeld:0},
            { where: {id: req.params.id} } ) 
            .then(apartment =>{
                res.json(apartment);
            })
    }catch(err){
       res.status(500).send(err)
    }
}

const getMinAndMaxFilterValues = async (req,res) =>{
    try{
        const {filtersFields} = req.query;
        const filtersFieldsPromises = filtersFields.map(async(fieldName)=>{
        try{
            const result =  await db.apartments.findAll({
                attributes: [
                    [Sequelize.fn('min', Sequelize.col(fieldName)), `min`],
                    [Sequelize.fn('max', Sequelize.col(fieldName)), `max`]
                ],
                where:{
                    enabeld:1
                }
            })
            let { dataValues: {min, max} } = result[0];
            min = min || 0;
            max = max || 0;
            return {[fieldName]: {min, max}};
        }catch(err){
            return null;
        }
        });
        const result = await Promise.all(filtersFieldsPromises)
        res.json(result);
    }catch(err){
        res.status(500).send(err);
    }
}

const updateApartment = (req,res) =>{
    try{
        featuresArr = req.body.state.features;
        db.apartments.update(
                            req.body.state,
                            { where: {id: req.params.id} } 
        )
        .then((apartment)=>{
            featuresArr.map ( feature => {
                db.apartment_feature.destroy({
                    where:{
                        apartment_id:req.params.id
                    }
                })
                db.apartment_feature.create(
                    {
                        apartment_id:req.params.id,
                        feature_id: feature
                    },
                )
            })
            res.json(apartment);
        })
    }catch(err){
        res.status(500).send(err)
    }
}

module.exports = {
    getApartments,
    createApartment,
    removeApartment,
    getFeatures,
    getMinAndMaxFilterValues,
    updateApartment,
    getApartmentById,
    createImagesRows,
}
