const articlesRouter = require('express').Router();
const {
  getArticleById,
  removeArticleById,
  updateArticleById,
  addNewCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  addNewArticle
} = require('../controllers/articles-controller');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  //.delete(removeArticleById)

articlesRouter
  .route('/:article_id/comments')
  .post(addNewCommentByArticleId)
  .get(getCommentsByArticleId)

articlesRouter
  .route('/')
  .get(getArticles)
  .post(addNewArticle)

module.exports = articlesRouter;