const knex = require("../database");
module.exports = {
  async moviesByGenre(req, res, next) {
    try {
      const movies = await knex("movies").orderBy("id");
      const genres = await knex("genres");
      return res.json({
        mostPopularMovies: movies.slice(0, 5),
        moviesByGenres: genres.map((genre) => {
          return {
            ...genre,
            movies: movies
              .slice(5)
              .filter((movie) => movie.main_genre === genre.id),
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  async movieById(req, res, next) {
    try {
      const { id } = req.params;
      const { user_id } = req.query;
      const movie = await knex("movies").where({ id });

      const [user_interactions] = await knex("interactions")
        .select()
        .where({ user_id, movie_id: id });

      const [user_recommendations_interactions] = await knex(
        "recommendations_interactions"
      )
        .select()
        .where({ user_id, movie_id: id });

      return res.json({
        user_recommendations_interactions,
        user_interactions,
        ...movie?.[0],
      });
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      await knex("movies").insert(req.body);
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  },
};
