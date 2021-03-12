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
          return Promise.reject({status: 404, msg: `Article ${article_id} does not exist. Please try different article Id!`})
      }
 })
}

exports.patchArticleById = (article_id, inc_votes) => {
  return dbConnection('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article.length === 0) {
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

exports.checkIfArticleExists = (article_id) => {
  return dbConnection('articles')
    .select('*')
    .where({ article_id })
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: `There is no article ${article_id} yet!` });
      };
    });
}

exports.postCommentByArticleId = (article_id, { username, body }) => {

  const newComment = {
    body: body,
    article_id: article_id,
    author: username,
    votes: 0,
    created_at: new Date()
  };
  return dbConnection('comments')
    .insert(newComment)
    .returning('*')
    .then(([comment]) => {
      return comment;
  })
}

exports.fetchCommentsByArticleId = (article_id, sort_by , order) => {
  return dbConnection
    .select('*')
    .from('comments')
    .where({article_id})
    .orderBy(sort_by || 'created_at', order || 'desc')
    .returning('*')
    // .then(comments => {
    //   if (!comments.length) {
    //     return Promise.reject({ status: 404, msg: `There are no comments for article ${article_id} yet. Be the first to add your comments!` })
    //   }
    //   else {
    //     return comments;
    //   };
    // });
}

exports.fetchArticles = (sort_by, order, author, topic) => {
  return dbConnection
    .select('articles.*')
    .from('articles')
    .count('comments.comment_id', { as: 'comment_count' })
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify((query) => {
      if (author) {
        query.where('articles.author', author);
      }
      if (topic) {
        query.where('articles.topic', topic);
      }
    })
    .returning('*')
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles found",
        })
      } else {
        return articles;
      }
    })
}

exports.postArticle = (article) => {
  return dbConnection('articles')
    .insert(article)
    .returning('*')
    .then(([article]) => {
      return article;
  })
}
