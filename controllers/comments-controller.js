const { fetchCommentById, patchCommentById } = require('../models/comments-model');

exports.updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  fetchCommentById(comment_id).then((comment) => {
    if (!comment.length) {
      return Promise.reject({
        status: 400,
        msg: 'Sorry - the comment you have asked to update does not exist!',
      });
    } else if (!inc_votes) {
      return Promise.reject({
        status: 404,
        msg: 'Could not update. Please check the spelling of the key fields!',
      });
    }
    patchCommentById(comment_id, inc_votes).then(comment => {
      res.status(200).send({ comment });
    })
  })
    .catch(err => next(err));
}