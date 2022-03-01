const knex = require("../database");
const { evaluationAverage } = require("../utils/evaluationAverage");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("interactions");
      return res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexByUser(req, res, next) {
    try {
      const { user_id } = req.params;
      const results = await knex("interactions as i")
        .where({ user_id })
        .join("movies as m", "m.id", "i.movie_id")
        .select("m.*", "m.id as movie_id", "i.id", "i.rate");
      return res.json(
        results?.map((result) => {
          const { id, rate, movie_id, ...movie } = result;
          return {
            id,
            rate,
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
      const { rate, user_id, movie_id } = req.body;

      const [{ id }] = await knex("interactions")
        .insert({
          rate,
          user_id,
          movie_id,
        })
        .returning("id");

      const allInteractionsByMovie = await knex("interactions").where({
        movie_id,
      });

      const rate_average = evaluationAverage(allInteractionsByMovie);

      await knex("movies").update({ rate_average }).where({ id: movie_id });

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
      const { rate, user_id, movie_id } = req.body;

      await knex("interactions")
        .update({
          rate,
          user_id,
          movie_id,
        })
        .where({ id });

      const allInteractionsByMovie = await knex("interactions").where({
        movie_id,
      });

      const rate_average = evaluationAverage(allInteractionsByMovie);

      await knex("movies").update({ rate_average }).where({ id: movie_id });

      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await knex("interactions").where({ id }).del();
      return res.send();
    } catch (error) {
      next(error);
    }
  },
};
