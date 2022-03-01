const { getGenres } = require("../../utils/getGenres");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("genres")
    .del()
    .then(async () => {
      await getGenres().then(async (data) => {
        await knex("genres").insert([...data]);
      });
    });
};
