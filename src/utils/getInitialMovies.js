require("dotenv/config");
const axios = require("axios");

const URL = `${process.env.BASE_URL}/discover/movie?sort_by=popularity.desc&language=pt-BR&api_key=${process.env.API_KEY}`;

const request = (page = 1) => `${URL}&page=${page}`;

const numOfMovies = 1000;

const allURLS = () => {
  const numberOfRequisitions = Number((numOfMovies / 20).toFixed());
  const arrayWithNumberOfRequisitions = Array.from(
    Array(numberOfRequisitions).keys()
  );
  return arrayWithNumberOfRequisitions?.map((num) => request(num + 1));
};

exports.getInitialMovies = async () => {
  try {
    const responses = await axios.all(allURLS().map((url) => axios.get(url)));
    const allResults = [];
    responses.forEach((res) => {
      allResults.push(
        ...res?.data?.results?.map(
          ({
            title,
            overview,
            backdrop_path,
            poster_path,
            release_date,
            genre_ids,
          }) => ({
            title,
            overview,
            backdrop_path,
            poster_path,
            release_date,
            main_genre: genre_ids[0],
            genre_ids: JSON.stringify(genre_ids),
            rate_average: 0,
            total_interactions: 0,
          })
        )
      );
    });
    return allResults;
  } catch (err) {
    return err;
  }
};
