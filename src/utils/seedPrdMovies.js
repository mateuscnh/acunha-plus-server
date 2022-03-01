const knex = require("../database/index");
const axios = require("axios");

const URL = "https://acunha-plus-server.herokuapp.com/movies";

const seedPrdMovies = async () => {
  const results = await knex("movies")
    .where("id", ">", 900)
    .where("id", "<=", 1000)
    .orderBy("id");
  await axios.post(URL, results);
};

seedPrdMovies();
