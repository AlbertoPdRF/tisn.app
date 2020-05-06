# Back end of Tisn

The back end is currently hosted on [Heroku](https://heroku.com/).

The database is currently hosted on [mongoDB Atlas](https://cloud.mongodb.com/), and is the same one as used during development. There's also a script that populates your database with some interests and categories. To run it, use the command `node db/populate 'YOUR_MONGODB_URL'`.
