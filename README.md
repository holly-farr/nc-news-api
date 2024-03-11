# Northcoders News API

### [Link to Hosted Version](https://nc-news-backend-wuav.onrender.com/api)

Northcoders News API is a project that mimics a real world backend service, which can access application data programmatically and provide it to front end architecture. 

## Set up the local repository
Clone the repository (HTTPS) and navigate to the project directory:
```js
  git clone https://github.com/holly-farr/nc-news-api.git

  cd nc-news
```
Install dependencies:
```js
  npm install
```
Setup databases:
```js
  npm run setup-dbs
```
Seed local database:
```js
  npm run seed
```
## Run tests
The test database does not need to be manually seeded as it is seeded when tests are run.

To run app tests:
```js
npm t app
```
To run utils tests:
```js
npm t utils
```
To run all tests in the repository:
```js
npm t
```
## Environment Variables
This project requires two .env files:

* Create .env.test file (see .env-example, check db/setup.sql for database name)

* Create .env.development file (see .env-example, check db/setup.sql for database name)


### Minimum Versions 
Node.js: v21.5.0

PostgreSQL: v14.11

### Author
[Holly Farr](https://www.linkedin.com/in/hollyfarr/)


