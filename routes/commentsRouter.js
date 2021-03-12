const commentsRouter = require('express').Router();

const { updateCommentById } = require('../controllers/comments-controller');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentById)


module.exports = commentsRouter;