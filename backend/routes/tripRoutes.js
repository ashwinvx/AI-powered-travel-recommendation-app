const { Router } = require('express');
const tripController = require('../controllers/tripController')
const router = Router();

router.post('/generate', tripController.generatetrips_post);
router.get('/', tripController.allsavedtrips_get);
router.get('/:id', tripController.tripid_get);
module.exports = router;