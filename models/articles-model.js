const dbConnection = require('../db/dbConnection');

exports.deleteArticleById = (article_id) => {
  // return dbConnection('articles')
  //   .where({'article_id', article_id})
  //   .del()
  //   .then(delCount => {
  //     if (!delCount) {
  //       return Promise.reject({ status: 404, msg: 'This article NOT found!'}) 
  //     }
  // })
}

exports.fetchArticleById = (article_id) => {
  return dbConnection
    .select('articles.*')
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .then(([article]) => {
      if (article) {
        return article;
      } else {
          return Promise.reject({status: 404, msg: 'This article does not exist. Please try different article Id!'})
      }
 })
}

exports.patchArticleById = (article_id, inc_votes) => {
  return dbConnection('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg:
            'TRY AGAIN! - It seems that the article that you are trying to update does not exist or has been moved!'
        });
      } else if (inc_votes === undefined) {
        return Promise.reject({
          status: 404,
          msg: 'ERROR: could not update. Please check the spelling of the key fields!'
        });
      } else {
        return article;
      }
    })
}

exports.postComments = (article_id, {username, body}) => {
  const author = username;
  return dbConnection('comments')
    .insert(article_id, author, body)
    .returning('*')
    .then(([comment]) => {
      console.log(comment)
      return comment
  })
}

/*
exports.insertNewComment = (article_id, { username, body }) => {
  const author = username;
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*");
};
*/
