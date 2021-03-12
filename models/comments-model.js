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
    });
}

exports.deleteCommentsById = (comment_id) => {
  return dbConnection('comments')
    .where({ comment_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No comments found!'
        })
      }
    })
}