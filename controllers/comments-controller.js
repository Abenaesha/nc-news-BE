const { fetchCommentById, patchCommentById, deleteCommentsById, checkIfCommentExists, validateCommentId } = require('../models/comments-model');

exports.updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    patchCommentById(comment_id, inc_votes),
    checkIfCommentExists(comment_id),
    validateCommentId(comment_id)
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(err => next(err));
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([
    deleteCommentsById(comment_id),
    validateCommentId(comment_id),
    checkIfCommentExists(comment_id)
  ]).then(() => {
    res.status(204).send();
  })
    .catch(err => (next(err)));
}