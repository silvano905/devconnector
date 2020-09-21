const { Router } = require('express');
const usersController = require('../../controllers/usersController');

//create router instance
const router = Router();

router.post('/', usersController.create_user);
router.get('/', usersController.user_info);


module.exports = router;