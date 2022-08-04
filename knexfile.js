// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
   development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'emp_tasks',
      user:     'postgres',
      password: 'qwerty1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  },
};
