const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const hashedPwd = await bcrypt.hash('admin', 10);
  const hashedPwdM = await bcrypt.hash('emp1', 10); 
  const hashedPwdME = await bcrypt.hash('emp2', 10);

  await knex('users').insert([
    {id: 1, fullname: 'Okaev Admin', login: 'admin', password: hashedPwd, role_id: 1001}, 
    {id: 2, fullname: 'Salomov Maanger', login: 'emp1', password: hashedPwdM, role_id: 1002},
    {id: 3, fullname: 'Botirov Employee', login: 'emp2', password: hashedPwdME, role_id: 1003} 
  ]);
};
