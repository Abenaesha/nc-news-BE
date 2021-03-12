const commentsRouter = require('express').Router();

const { updateCommentById, removeCommentById } = require('../controllers/comments-controller');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentById)
  .delete(removeCommentById)


module.exports = commentsRouter;