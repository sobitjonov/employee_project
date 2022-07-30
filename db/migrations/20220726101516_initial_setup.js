/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('users', function(table){  
        table.increments().primary()
        table.text('fullname', 500).notNullable()
        table.text('login').unique().notNullable()
        table.text('password').notNullable()
        table.integer('role_id').notNullable()
        table.text('refresh_token')
        table.timestamps(true, true);
      })
      .createTable('tasks', function(table){
        table.increments().primary();
        table.text('name', 250).notNullable()     
        table.integer('status').notNullable()// 0-active  1-finished/approvda  2-approve qilindi 
        table.integer('manager_id').notNullable().references('id').inTable('users');
        table.integer('employee_id').notNullable().references('id').inTable('users');
        table.timestamp('connected_date'); 
        table.timestamp('due_date').notNullable();
        table.timestamp('finished_date');
        table.timestamps(true, true);
      })
      .createTable('task_history', function(table){ 
        table.increments().primary();
        table.integer('action_type').notNullable() // 0-deleted 1-created 2-updated
        table.integer('action_user_id').notNullable().references('id').inTable('users');
        table.integer('task_id').notNullable().references('id').inTable('tasks');
        table.text('name', 250).notNullable()     
        table.integer('status').notNullable()// 0-active  1-finished/approvda  2-approve qilindi 
        table.integer('manager_id').notNullable().references('id').inTable('users');
        table.integer('employee_id').notNullable().references('id').inTable('users');
        table.timestamp('connected_date'); 
        table.timestamp('due_date').notNullable();
        table.timestamp('finished_date');
        table.timestamps(true, true); 
      })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('task_history')
        .dropTable('tasks')
        .dropTable('users')
}
