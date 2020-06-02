const express = require('express');
const router = express.Router();
const apartmentsController = require('../controllers/apartmentsController');

router.get('/',apartmentsController.getApartments); 
router.get('/initFilters',apartmentsController.getMinAndMaxFilterValues);
router.get('/show/:id',apartmentsController.getApartmentById);
router.get('/features',apartmentsController.getFeatures); 
router.post('/create', apartmentsController.createApartment);
router.post('/:id/images', apartmentsController.createImagesRows);
router.delete('/:id',apartmentsController.removeApartment);
router.put('/edit/:id',apartmentsController.updateApartment);


module.exports = router;
 