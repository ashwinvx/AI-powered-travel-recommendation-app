const { Router } = require('express');
const tripController = require('../controllers/tripController')
const router = Router();

router.post('/generate', tripController.generatetrips_post);
router.get('/', tripController.allsavedtrips_get);
router.get('/:id', tripController.tripid_get);
router.patch('/:id', tripController.tripid_update);
router.get('/:id/map-data', tripController.tripidmapdata_get);
router.patch('/edit/:id', tripController.tripid_aiupdate);


module.exports = router;