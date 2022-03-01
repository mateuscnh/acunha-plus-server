require("dotenv/config");
const parse = require("pg-connection-string").parse;

const pgconfig = parse(process.env.DATABASE_URL);
pgconfig.ssl = { rejectUnauthorized: false };

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://postgres:postgres@localhost/acunha_plus",
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/src/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`,
    },
  },
  production: {
    client: "pg",
    connection: pgconfig,
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/src/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`,
    },
  },
};
