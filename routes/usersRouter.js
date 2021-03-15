const usersRouter = require('express').Router();
const {
  getUsersByUsername,
  getUsers,
  addNewUser
} = require('../controllers/users-controller');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addNewUser)

usersRouter
  .route('/:username')
  .get(getUsersByUsername)

module.exports = usersRouter;