const dbConnection = require('../db/dbConnection');

exports.checkIfArticleExists = (article_id) => {
  return dbConnection('articles')
    .select('*')
    .where({ article_id })
    .then((article) => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: `Article ID ${article_id} not found!`
        });
      };
    });
};

exports.checkIfAuthorExists = ({ author }) => {
  if (author) {
    return dbConnection('users')
      .select('*')
      .where('username', author)
      .then(([users]) => {
        if (!users) {
          return Promise.reject({
            status: 404,
            msg: `Author ${author} not found!`
          });
        }
      });
  }
};

exports.checkIfTopicExists = ({ topic }) => {
  if (topic) {
    return dbConnection('topics')
      .select('*')
      .where('slug', topic)
      .then(([topics]) => {
        if (!topics) {
          return Promise.reject({
            status: 404,
            msg: `Topic ${topic} not found!`
          });
        }
      });
  }
};

exports.validateArticleId = (id) => {
  if (/[^\d]/g.test(id)) {
    return Promise.reject({
      status: 400,
      msg: `Article ID ${id} is invalid!`
    });
  }
};

exports.fetchArticles = ({sort_by, order, author, topic, limit, p}) => {
  if (order) {
    if (order !== 'desc' && order !== 'asc') {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request!'
      });
    };
  };
  return dbConnection
    .select('articles.*')
    .from('articles')
    .count('comments.comment_id', { as: 'comment_count' })
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit || 10)
    .modify((query) => {
      if (author) {
        query.where('articles.author', author);
      }
      if (topic) {
        query.where('articles.topic', topic);
      }
      if (p) {
        query.offset(limit || 10)
      }
    })
    .returning('*')
    .then((articles) => {
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: `No articles found for ${author || topic}!`
        })
      }
      return { articles, total_count: articles.length };
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

exports.deleteArticleById = (article_id) => {
  return dbConnection('articles')
    .where({ article_id })
    .del()
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: 'This article NOT found!'
        })
      }
  })
}

exports.fetchArticleById = (article_id) => {
  return dbConnection
    .select('articles.*')
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .then(([article]) => article)
}

exports.patchArticleById = (article_id, inc_votes) => {
  return dbConnection('articles')
    .where({ article_id })
    .increment('votes', inc_votes || 0)
    .returning('*')
    .then(([article]) => {
      if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: 'Could not update. Check the spelling of the key fields!'
        });
      } else {
        return article;
      }
    })
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

exports.fetchCommentsByArticleId = (article_id, {sort_by , order, limit, p}) => {
  if (order) {
    if (order !== 'asc' && order !== 'desc') {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request!'
      });
    }
  }
  return dbConnection
    .select('*')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit || 10)
    .modify(query => {
      if (p) {
        query.offset(limit || 10)
      }
    })
    .returning('*')
    // .then(comments => {

    //   if (!comments.length) {
    //     return Promise.reject({
    //       status: 404,
    //       msg: `Article ID ${article_id} has no comments!`
    //     })
    //   }
    //   else {
    //     return comments;
    //   };
    // });
}


