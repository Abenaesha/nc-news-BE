exports.up = function (knex) {
  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topics.slug").onDelete('CASCADE')
    articleTable.string("author").references("users.username").onDelete('CASCADE')
    articleTable.timestamp("created_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
