# Gympoint Backend

Backend da aplicação __Gympoint__ para avaliação final do GoStack.

## Serviços

1. Users
    - __POST__ Create an user
    - __PUT__ Update user except password __*#authRequired*__
2. Password
    - __PUT__ Update: only password __*#authRequired*__
3. Forgot Password
    - __POST__ Create token and sending e-mail with link to reset
    - __PUT__ Update
4. Session
    - __POST__ Create: login returns JWT token
5. Students  __*#authRequired*__
    - __GET__ List all with pagination
    - __GET__ Show one
    - __POST__ Create
    - __PUT__ Update
    - __DELETE__ Delete
6. Plans  __*#authRequired*__
    - __GET__ List all with pagination
    - __GET__ Show one
    - __POST__ Create
    - __PUT__ Update
    - __DELETE__ Delete
6. Registrations  __*#authRequired*__
    - __GET__ List all with pagination
    - __GET__ Show one
    - __POST__ Create
    - __PUT__ Update
    - __DELETE__ Delete
7. Chekin
    - __GET__ List all with pagination
    - __POST__ Create
8. Help orders - Questions
    - __GET__ List all of a student with pagination
    - __POST__ Create
8. Help orders - Answer __*#authRequired*__
    - __GET__ List all non answered questions
    - __POST__ Create an answer



## Como usar

```
# Clone repository
$ git clone https://github.com/rvieceli/gympoint_backend.git

# Enter repository folder
$ cd gympoint_backend

# Install dependencies
$ yarn

# Create .env based on .env.example
- NODE_ENV
- APP_URL
- APP_SECRET
- DB
- REDIS
- MAIL

# Run migrate to your databse
$ yarn sequelize db:migrate

# Seed teste informations
$ yarn sequelize db:seed:all

# Run app server
$ yarn dev

# Run queue
$ yarn queue

```


