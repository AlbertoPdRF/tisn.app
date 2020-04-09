# Tisn - The introverts' social network

A preview of the application can be seen [here](https://tisn.app/).

## Development

[Node.js](https://nodejs.org/) (version 12.x) is required.

Clone the repository:

```bash
git clone https://github.com/AlbertoPdRF/tisn.git
cd tisn
```

### Front end

```bash
cd client
npm install
npm start
```

### Back end

```bash
cd api
npm install
npm start
```

If [nodemon](https://nodemon.io/) is installed globally, the server can be ran with the script `npm run start:dev` instead.

Also, a `.env` file with the following secrets is necessary:

```
DB_URL=""
JWT_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Production

To easily deploy changes there is the `deploy.sh` script. The script accepts the `api` and/or `client` commands, to deploy changes to the back and/or front end respectively. Executing the script without specifying any command (i.e. `./deploy.sh`) will deploy changes to both the back and front ends.
