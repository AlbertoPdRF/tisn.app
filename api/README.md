# Back end of Tisn

The back end is currently hosted on [Heroku](https://heroku.com/).

## Database

The applications uses [MongoDB](https://www.mongodb.com/) and [mongoose](https://mongoosejs.com/). The production database is currently hosted on [MongoDB Atlas](https://cloud.mongodb.com/).

### Populate collections

There's a script that can be used to populate all the collections with dummy data. Run it with the command `npm run db:populate`.

The following arguments can be passed to the script:

- `-c` or `--collection`, specify the collection you want to populate.
- `-m` or `--multiplier`, multiply the default number of users (10) and events (50) generated.
- `-r` or `--random-location`, randomizes the country and region each user and event is located in. By default, all users and events are located in Madrid, Spain.
- `-v` or `--verbose`, logs each generated document to the console.

When the users collection is first populated, an admin user with the following information is also generated:

- Name: `Admin`
- Email: `admin@tisn.app`
- Password: `password`

All generated users have `password` as their password.

### Drop collections

There's also a script that can be used to drop all the collections. Run it with the command `npm run db:drop`.

The following arguments can be passed to the script:

- `-c` or `--collection`, specify the collection you want to drop.
