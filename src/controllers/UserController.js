const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("users");
      return res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const [{ id }] = await knex("users")
        .insert({
          name,
        })
        .returning("id");
      return res.status(201).send({ id });
    } catch (error) {
      next(error);
    }
  },
};
