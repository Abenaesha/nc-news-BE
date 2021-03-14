const dbConnection = require('../db/dbConnection');

exports.checkIfCommentExists = (comment_id) => {
  return dbConnection('comments')
    .select('*')
    .where({ comment_id })
      .then(([comment]) => {
        // (comment, '*8')
        if (!comment) {
          return Promise.reject({
            status: 404,
            msg: `Comment ID ${comment_id} does not exist!`
          })
        }
    })
}

exports.validateCommentId = (id) => {
  if (/[^\d]/g.test(id)) {
    return Promise.reject({
      status: 400,
      msg: `Comment ID ${id} is invalid!`
    })
  }
}

exports.fetchCommentById = (comment_id) => {
  return dbConnection('comments')
    .where({ comment_id });
};

exports.patchCommentById = (comment_id, inc_votes) => {
  return dbConnection('comments')
    .where({ comment_id })
    .increment('votes', inc_votes || 0)
    .returning('*')
    .then(([comment]) => {
      if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: 'Could not update. Please check the spelling of the key fields!'
        });
      }
      return comment;
    });
}

exports.deleteCommentsById = (comment_id) => {
  return dbConnection('comments')
    .where({ comment_id })
    .del();
}