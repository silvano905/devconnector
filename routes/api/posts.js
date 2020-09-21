const { Router } = require('express');
const postController = require('../../controllers/postController');
const checkObjectId = require('../../middleware/checkObjectId');

//create router instance
const router = Router();

router.post('/', postController.post_create_post);
router.get('/', postController.get_posts);
router.get('/:id',checkObjectId('id'), postController.get_post_byID);
router.delete('/:id',checkObjectId('id'), postController.delete_post);
router.put('/like/:id',checkObjectId('id'), postController.put_like_post);
router.put('/unlike/:id',checkObjectId('id'), postController.put_unlike_post);
router.post('/comment/:id',checkObjectId('id'), postController.post_comment_on_post);
router.delete('/comment/:id/:comment_id', postController.delete_comment_on_post);

module.exports = router;

