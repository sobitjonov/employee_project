/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('users', function(table){  
        table.increments().primary().unsigned();
        table.text('fullname', 500).notNullable()
        table.text('login').unique().notNullable()
        table.text('password').notNullable()
        table.integer('role_id').notNullable()
        table.text('refresh_token')
        table.timestamps(true, true);
        // table.foreign('role_id').references('roles.id');
      })
    //   .createTable('roles', function (table) {
    //     table.increments('id').primary();
    //     table.string('name');
    //     table.integer('paper_id').unsigned()
    //     table.foreign('paper_id')
    //       .references('papers.id');
  
    //     table.timestamps(true, true);
    //   })
      .createTable('tasks', function(table){
        table.increments().primary();
        table.text('name', 250).notNullable()
        table.boolean('status').notNullable()
        table.integer('manager_id').references('id').inTable('users').notNullable()
        table.integer('employee_id').references('id').inTable('users');
        table.timestamp('connected_date');
        table.timestamps(true, true);
        table.timestamp('due_date');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('tasks')
        .dropTable('users')
        // .dropTable('roles')
};
