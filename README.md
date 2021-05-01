# NC News API

...this a simple API project is part of the backend module that was built as a closing chapter of a Full-Stack Web Development Bootcamp.
## Overview

The sole aim of this project was to learn how to practice Node.js and interact with database like PostgresSQL, and using different tenchologies like Express framework, Knex QueryBuilder, Jest and Supertest. Also, this API will be used to build to the frontend side and form a full engaging webapp.

## API functionality

This API is Reddit replica of a dummy database which serves news articles and comments to the user, along with metadata relating to those items. One of the key features is letting the users to post articles, delete comments on articles.


## Interating with the API

Requests to the API can be made as endpoints on the URL with an example of a list of all endpoints [API server](https://xeddit.herokuapp.com/api)

## To get started

In order to run the source code in this repo yourself, you'll first need to clone the repo. 

You'll also need to have the following dependencies installed:

- Node.js
- PostgreSQL
- Knex
- Express

The minimum version of node.js required for the code to run is 15.2.0.
The other dependencies and their versions are included in the package.json, so you should be able to install them by entering running `npm install` in your terminal.

You will also need a file called knexfile.js. To create this file, you can run `knex init` in the terminal. The knexfile should look like this:

```js
const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;
const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      // for Linux users
      // username: 'xxxxxx',
      // password: 0000,
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      // for Linux users
      // username: 'xxxxxx',
      // password: 0000,
    },
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
module.exports = { ...customConfig[ENV], ...baseConfig };
```
Linux users should un-comment and complete their username and password in customConfigs.

## Seeding to database and starting the API

To populate the news database with the data contained in the /db directory, run `npm seed` in the terminal.

This is a hoisting file which you guide you through when you are at the hoisting stage.
