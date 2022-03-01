exports.up = (knex) =>
  knex.schema.createTable("movies", (table) => {
    table.increments("id");
    table.text("title");
    table.text("overview");
    table.text("backdrop_path");
    table.text("poster_path");
    table.text("release_date");
    table.float("rate_average");
    table.integer("main_genre");
    table.text("genre_ids");
  });

exports.down = (knex) => knex.schema.dropTable("movies");
