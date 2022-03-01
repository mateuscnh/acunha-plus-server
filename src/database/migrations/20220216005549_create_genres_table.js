exports.up = (knex) =>
  knex.schema.createTable("genres", (table) => {
    table.integer("id");
    table.text("name");
  });

exports.down = (knex) => knex.schema.dropTable("genres");
