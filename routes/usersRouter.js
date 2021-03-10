const usersRouter = require('express').Router();
const { getUsersByUsername } = require('../controllers/users-controller');

usersRouter.get('/:username', getUsersByUsername)

module.exports = usersRouter;