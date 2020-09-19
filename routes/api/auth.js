const { Router } = require('express');
const authController = require('../../controllers/authController');

//create router instance
const router = Router();

router.post('/', authController.login_user);
router.get('/', authController.user_info);

module.exports = router;