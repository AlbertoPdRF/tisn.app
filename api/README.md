# Back end of Tisn

The back end is currently hosted on [Heroku](https://heroku.com/).

The production database is currently hosted on [MongoDB Atlas](https://cloud.mongodb.com/). There's a script that can be used to populate the database with interests and users. To run the script and to populate all collections, use the command `npm run db:populate`.

## Advanced Options

The following flags can be used when populating the database:

- `-c` or `--collection`, specify the collection you wish to populate.
- `-m` or `--multiplier`, multiply the default number of users generated.
- `-r` or `--random-location`, randomizes the country and region each user is located.
- `-v` or `--verbose`, logs each document generated.

Example:

`npm run db:populate -- -c users -m 5 --verbose`

This example will populate the users collection with 500 users and will log to the console each user created.

When the users collection is first populated it also generates an admin user with the following information:

- Name: Admin
- Email: admin@tisn.app
- Password: password

Each user's password generated from the script is `password`.

**Note:** Default number of users generated is 100 and the default location each user is from is Madrid, Spain.

## Deleting Collections

To drop the database, run `npm run db:drop`. This will drop all collections in the database.

The following flags can be used when deleting the database:

- `-c` or `--collection`, specify the collection you wish to delete.

Example:

`npm run db:drop -- -c users`
