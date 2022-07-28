const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const hashedPwd = await bcrypt.hash('admin', 10);
  await knex('users').insert([
    {id: 1, fullname: 'Okaev Admin', login: 'admin', password: hashedPwd, role_id: 1001}, 
  ]);
};
