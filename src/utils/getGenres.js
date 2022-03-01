require("dotenv/config");
const axios = require("axios");

const URL = `${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=pt-BR`;

exports.getGenres = async () => {
  try {
    const { data } = await axios.get(URL);
    return data?.genres;
  } catch (err) {
    return err;
  }
};
