# Back end of Tisn

The back end is currently hosted on [Heroku](https://heroku.com/).

The production database is currently hosted on [MongoDB Atlas](https://cloud.mongodb.com/). There's a script that can be used to populate the database with interests and users. To run them, use the commands `node db/populate-interests 'MONGODB_URL'` and `node db/populate-users 'MONGODB_URL'` respectively.
