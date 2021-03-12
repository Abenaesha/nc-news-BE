const dbConnection = require('../db/dbConnection');

exports.fetchCommentById = (comment_id) => {
  return dbConnection('comments')
    .where({ comment_id });
};

exports.patchCommentById = (comment_id, inc_votes) => {
  return dbConnection('comments')
    .where({ comment_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      return comment;
  })
}