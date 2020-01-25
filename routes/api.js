const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

const controllers = {
  api: require('../controllers/api'),
};

router.get('/map', controllers.api.get_default_map);
router.get('/map/:m_name', auth.restrict, controllers.api.get_map);
router.put('/map/:m_name', auth.restrict, controllers.api.put_map);
router.get('/version/:m_name', auth.restrict, controllers.api.get_version);

module.exports = router;