const knex = require("../database");
const { interactionsGroupedByUser } = require("../utils/handleRecommendations");
const { collaborativeFiltering } = require("../utils/collaborativeFiltering");
const { contentBasedFiltering } = require("../utils/contentBasedFiltering");

module.exports = {
  async index(req, res, next) {
    try {
      const { user_id } = req.query;

      // Collaborative filtering
      const [userInteractions] = await knex("users as u")
        .where({ user_id })
        .join("interactions as i", "u.id", "i.user_id")
        .select("u.id", "u.name", "i.rate", "i.movie_id")
        .then((data) => interactionsGroupedByUser(data));
      const allInteractions = await knex("users as u")
        .whereNot({ user_id })
        .join("interactions as i", "u.id", "i.user_id")
        .select("u.id", "u.name", "i.rate", "i.movie_id")
        .then((data) => interactionsGroupedByUser(data));

      const allMoviesId = collaborativeFiltering(
        userInteractions,
        allInteractions
      );

      // Content based filtering
      const userMoviesGenres = await knex("interactions as i")
        .where({ user_id })
        .join("movies as m", "m.id", "i.movie_id")
        .select("m.genre_ids", "m.id")
        .then((data) =>
          data.map((result) => ({
            ...result,
            genre_ids: JSON.parse(result.genre_ids),
          }))
        );

      const allMoviesGenres = await knex("movies as m")
        .select("m.genre_ids", "m.id")
        .then((data) =>
          data
            .map((result) => ({
              ...result,
              genre_ids: JSON.parse(result.genre_ids),
            }))
            .filter(
              (movie) =>
                !userMoviesGenres.find((userMovie) => userMovie.id === movie.id)
            )
        );

      const allRecommendedMoviesIds = contentBasedFiltering(
        userMoviesGenres,
        allMoviesGenres
      );

      const allItemsIds = [
        ...new Set(
          allMoviesId.slice(0, 5).concat(allRecommendedMoviesIds.slice(0, 5))
        ),
      ];

      const allMovies = await knex("movies as m")
        .whereIn("id", allItemsIds)
        .then((data) => {
          data.sort((a, b) => {
            if (a.rate_average > b.rate_average) {
              return -1;
            }
            if (a.rate_average < b.rate_average) {
              return 1;
            }
            return 0;
          });
          return data;
        });

      return res.json(allMovies);
    } catch (error) {
      next(error);
    }
  },
  async indexInteractions(req, res, next) {
    try {
      try {
        const results = await knex("recommendations_interactions");
        return res.json(results);
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  },
  async indexInteractionsByUser(req, res, next) {
    try {
      const { user_id } = req.params;
      const results = await knex("recommendations_interactions as i")
        .where({ user_id })
        .join("movies as m", "m.id", "i.movie_id")
        .select("m.*", "m.id as movie_id", "i.id", "i.liked");
      return res.json(
        results?.map((result) => {
          const { id, movie_id, liked, ...movie } = result;
          return {
            id,
            liked,
            user_id: Number(user_id),
            movie_id,
            data: { id: movie_id, ...movie },
          };
        })
      );
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const { liked, user_id, movie_id } = req.body;

      const [{ id }] = await knex("recommendations_interactions")
        .insert({
          liked,
          user_id,
          movie_id,
        })
        .returning("id");
      return res.status(201).send({
        id,
      });
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { liked, user_id, movie_id } = req.body;

      await knex("recommendations_interactions")
        .update({
          liked,
          user_id,
          movie_id,
        })
        .where({ id });
      return res.send();
    } catch (error) {
      next(error);
    }
  },
};
