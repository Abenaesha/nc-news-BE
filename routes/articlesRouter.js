const articlesRouter = require('express').Router();
const {
  getArticleById,
  removeArticleById,
  updateArticleById,
  addComments
} = require('../controllers/articles-controller');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  //.delete(removeArticleById)

articlesRouter
  .route('/:article_id/comments')
  .post(addComments)

module.exports = articlesRouter;