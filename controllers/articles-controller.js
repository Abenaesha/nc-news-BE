//const articles = require('../db/data/test-data/articles');
const {
  fetchArticleById,
  deleteArticleById,
  patchArticleById,
  postCommentByArticleId,
  fetchCommentsByArticleId,
  fetchArticles,
  checkIfArticleExists,
  checkIfAuthorExists,
  checkIfTopicExists,
  postArticle,
  validateArticleId
} = require('../models/articles-model');

exports.removeArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id).then(() => {
    res.status(204).send();
  })
    .catch(err => next(err))
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  Promise.all([
    validateArticleId(article_id),
    checkIfArticleExists(article_id),
    fetchArticleById(article_id)
  ])
    .then(([, , article]) => {
      res.status(200).send({article})
    })
    .catch(err => next(err))
}

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    patchArticleById(article_id, inc_votes),
    validateArticleId(article_id),
    checkIfArticleExists(article_id)
  ])
    .then(([article]) => {
      res.status(200).send({article});
    })
    .catch(err => next(err))
}

exports.addNewCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const post = req.body;
  Promise.all([
    postCommentByArticleId(article_id, post),
    validateArticleId(article_id),
    checkIfArticleExists(article_id)
  ])
    .then(([newComment]) => {
      res.status(201).send({ newComment })
    })
    .catch(err => next(err))
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticleId(article_id, req.query),
    checkIfArticleExists(article_id),
    validateArticleId(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err))
}

exports.getArticles = (req, res, next) => {
  Promise.all([
    checkIfAuthorExists(req.query),
    checkIfTopicExists(req.query),
    fetchArticles(req.query)
  ])
    .then(([, , articles]) => {
      res.status(200).send(articles);
  })
    .catch(err => next(err));
}

exports.addNewArticle = (req, res, next) => {
  postArticle(req.body).then((article) => {
    res.status(201).send({ article })
  })
    .catch(err => next(err));
}