development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'emp_tasks',
      user:     'postgres',
      password: 'qwerty1234'
},



>> npx knex migrate:down 
>> npx knex migrate:latest
>> npx knex seed:run  	