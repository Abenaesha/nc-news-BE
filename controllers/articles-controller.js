//const articles = require('../db/data/test-data/articles');
const { fetchArticleById, deleteArticleById, patchArticleById, postCommentByArticleId, fetchCommentsByArticleId, fetchArticles } = require('../models/articles-model');
exports.removeArticleById = (req, res, next) => {
  // const { article_id } = req.params;
  // deleteArticleById(article_id).then(() => {
  //   res.statusSend(204);
  // })
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article })
  })
    .catch(err => next(err));
}

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  })
    .catch(err => next(err))
}

exports.addCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const post = req.body;
  postCommentByArticleId(article_id, post).then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(err => next(err))
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  })
    .catch(err => next(err))
}

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles })
  })
    .catch(err => next(err));
}