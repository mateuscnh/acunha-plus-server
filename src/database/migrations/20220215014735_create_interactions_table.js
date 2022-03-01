exports.up = (knex) =>
  knex.schema.createTable("interactions", (table) => {
    table.increments("id");
    table.float("rate");
    table
      .integer("user_id")
      .references("users.id")
      .notNullable()
      .onDelete("CASCADE");
    table.integer("movie_id").references("movies.id").notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("interactions");
