const { Router } = require('express');
const profileController = require('../../controllers/profileController');

//create router instance
const router = Router();

router.post('/', profileController.add_profile);
router.get('/', profileController.get_all_profiles);
router.get('/user/:user_id', profileController.get_profile_byId);
router.delete('/', profileController.delete_profile);
router.put('/experience', profileController.add_experience);
router.delete('/experience/:exp_id', profileController.delete_experience);
router.put('/education', profileController.add_education);
router.delete('/education/:edu_id', profileController.delete_education);
router.get('/github/:username', profileController.github);
router.get('/me', profileController.my_profile);

module.exports = router;