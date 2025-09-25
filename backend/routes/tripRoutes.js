const { Router } = require('express');
const tripController = require('../controllers/tripController')
const router = Router();

router.post('/generate', tripController.generatetrips_post);
module.exports = router;