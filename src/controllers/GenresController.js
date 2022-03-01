const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("genres");
      return res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      await knex("genres").insert(req.body);
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  },
};
