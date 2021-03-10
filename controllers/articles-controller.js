const articles = require('../db/data/test-data/articles');
const { fetchArticleById, deleteArticleById, patchArticleById, postComments } = require('../models/articles-model');

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

exports.addComments = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  //console.log(newComment)
  postComments(article_id, newComment).then((comment) => {
    console.log(comment)
    res.status(201).send({comment})
  })
  .catch(err => next(err))
}