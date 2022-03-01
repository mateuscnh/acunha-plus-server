const { pearson } = require("./handleRecommendations");

const contentBasedFiltering = (loggedUserMovies, otherMovies) => {
  const rateSimilarMovies = [];
  loggedUserMovies.forEach((userMovie) => {
    const userMoviesRates = [];
    const userMovieGenres = userMovie.genre_ids;
    otherMovies.forEach((otherMovie) => {
      const otherMovieGenres = otherMovie.genre_ids;
      if (otherMovieGenres.length >= userMovieGenres.length) {
        userMoviesRates.push({
          id: otherMovie.id,
          genre_ids: otherMovieGenres,
          rate: pearson(userMovie.genre_ids, otherMovie.genre_ids),
        });
      }
    });
    rateSimilarMovies.push({
      id: userMovie.id,
      genre_ids: userMovieGenres,
      recommendedMovies: userMoviesRates,
    });
  });

  const moviesSortedByRate = rateSimilarMovies.map((similarMovie) => {
    const recommendedMovies = similarMovie.recommendedMovies;
    recommendedMovies.sort((a, b) => {
      if (a.rate > b.rate) {
        return -1;
      }
      if (a.rate < b.rate) {
        return 1;
      }
      return 0;
    });
    return {
      ...similarMovie,
      recommendedMovies: recommendedMovies.slice(0, 2),
    };
  });

  return [
    ...new Set(
      [].concat(
        ...moviesSortedByRate.map(({ recommendedMovies }) => {
          return recommendedMovies.map((movie) => movie.id);
        })
      )
    ),
  ]?.filter((n) => n);
};

module.exports = { contentBasedFiltering };
