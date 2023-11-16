const router = require('express').Router();

const { validateChangeUserInfo } = require('../middlewares/validation');

const { changeUserInfo, getMe } = require('../controllers/users');

router.patch('/users/me', validateChangeUserInfo, changeUserInfo );
router.get('/users/me', getMe );

module.exports = router;
