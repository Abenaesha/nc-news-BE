const express = require('express');
const articlesRouter = require('express').Router();
const {
  getArticleById,
  removeArticleById,
  updateArticleById,
  addCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require('../controllers/articles-controller');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  //.delete(removeArticleById)

articlesRouter
  .route('/:article_id/comments')
  .post(addCommentByArticleId)
  .get(getCommentsByArticleId)

articlesRouter
  .route('/')
  .get(getArticles)

module.exports = articlesRouter;