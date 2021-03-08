const {
  topicsData,
  articlesData,
  commentsData,
  usersData,
} = require("../data/index");
const { amendTimeStamp } = require("../utils/data-manipulation");

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
    .then(() => {
      console.log(commentsData);
    });
};
