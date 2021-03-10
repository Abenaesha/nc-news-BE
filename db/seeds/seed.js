const {
  topicsData,
  articlesData,
  commentsData,
  usersData,
} = require("../data/index");
const {
  amendTimeStamp,
  reformatData,
  createRefObject,
} = require("../utils/data-manipulation");

// seed

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("topics").insert(topicsData);
    })
    .then(() => {
      return knex("users").insert(usersData);
    })
    .then(() => {
      const correctedTimeStamp = amendTimeStamp(articlesData);
      return knex("articles").insert(correctedTimeStamp).returning("*");
    })
    .then((articles) => {
      const articlesRefObject = createRefObject(
        articles,
        "title",
        "article_id"
      );
      const correctedTimeStamp = amendTimeStamp(commentsData);
      const reformattedComments = reformatData(
        correctedTimeStamp,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        articlesRefObject
      );
      return knex("comments").insert(reformattedComments);
    });
};
