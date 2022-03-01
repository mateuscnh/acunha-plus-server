exports.up = (knex) =>
  knex.schema.createTable("recommendations_interactions", (table) => {
    table.increments("id");
    table.boolean("liked");
    table
      .integer("user_id")
      .references("users.id")
      .notNullable()
      .onDelete("CASCADE");
    table.integer("movie_id").references("movies.id").notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("recommendations_interactions");
