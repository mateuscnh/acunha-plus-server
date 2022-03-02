const seedInteractionsMovies = require("../../utils/seedInteractionsMovies");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("interactions").del();
  await knex("interactions").insert([...seedInteractionsMovies]);
};
