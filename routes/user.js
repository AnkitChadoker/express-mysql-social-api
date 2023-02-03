const router = require('express').Router();
const UserController = require('../controllers/user-controller')

router.get('/:id', UserController.index);
router.post('/follow', UserController.follow);
router.post('/unfollow', UserController.unfollow);
router.post('/block', UserController.block);
router.post('/unblock', UserController.unblock);

module.exports = router;