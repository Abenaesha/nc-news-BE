exports.up = function (knex) {
  return knex.schema.createTable("users", (userTable) => {
    userTable.string("username").primary().notNullable();
    userTable.string("avatar_url");
    userTable.string("name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
