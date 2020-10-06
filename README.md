<div align="center">
  <br>
  <img alt="Tisn" src="./client/public/logo192.png">
  <h1>Tisn - The introverts' social network</h1>
  <strong>Meet people while doing what you enjoy!</strong>
</div>

## Table of contents

- [What is tisn.app?](#what-is-tisnapp)
- [Contributing](#contributing)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Back end (or API, or server)](#back-end-or-api-or-server)
  - [Front end (or client)](#front-end-or-client)
  - [Important note](#important-note)
- [License](#license)

## What is tisn.app?

Welcome to the [tisn.app](https://tisn.app/) (or just Tisn) repository! We are very glad to have you here. If you want to help us make Tisn better, this is definitely the place to be!

The primary objective of Tisn is to try and address the problem of the apparent difficulty that exists to meet people and make new friends on this modern world. To do that, our social network:

1. Connects people according to their interests
2. Encourages people to go outside and meet others while doing something that they all enjoy
3. Is as simple as possible

We try to do all of that while being completely transparent and respecting our users' privacy.

## Contributing

We would love that you contribute to Tisn! We only ask you to please follow [our contributing guidelines](./CONTRIBUTING.md). You are also more than welcome to [join our Slack workspace](https://join.slack.com/t/tisn/shared_invite/zt-f90lp602-QKAWQFXzru2zy3cg3UuFBA)!

## Getting started

Clone the repository:

```bash
git clone https://github.com/tisn/tisn.app.git
cd tisn.app
```

We recommend [setting up an SSH key](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and clonning the repository with the command `git clone git@github.com:tisn/tisn.app.git` instead.

### Prerequisites

- [Node.js](https://nodejs.org/) version 12.x
  - We recommend using [nvm](https://github.com/nvm-sh/nvm/) to install and manage Node versions
- [MongoDB](https://www.mongodb.com/)
  - Alternatively, you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/)

### Back end (or API, or server)

Before starting, copy the `.env-template` file on the `api` folder to a new `.env` file on the same folder (i.e. `cp api/.env-template api/.env`) and fill it following these instructions:

- `DB_URL`: should be `mongodb://127.0.0.1:27017/tisn` unless you changed MongoDB's default port, want to give another name to the database, or are using MongoDB Atlas
- `JWT_SECRET`: can be any string
- `CLOUDINARY_CLOUD_NAME`: you can sign up on [Cloudinary](https://cloudinary.com/) using the free tier, however this key and the two below are only necessary if you want to upload files
- `CLOUDINARY_API_KEY`: same as above
- `CLOUDINARY_API_SECRET`: same as above
- `SENDGRID_API_KEY`: you can sign up on [SendGrid](https://sendgrid.com/) using the free tier, however this key is only necessary if you want to send emails, which by default are logged to the console in development mode. The default value is set to `SG.` to avoid an unnecesary error message being logged to the console
- `BASE_CLIENT_URL`: should be `http://localhost:3000` unless you change the port on which the client runs

Once that's done, you can install all the dependencies, populate the database, and launch the back end executing the following commands from the repository's root folder:

```bash
cd api
npm install
npm run db:populate
npm start
```

Further details about the back end can be found [here](./api/README.md).

### Front end (or client)

Install all the dependencies and launch the front end executing the following commands from the repository's root folder:

```bash
cd client
npm install
npm start
```

Further details about the front end can be found [here](./client/README.md).

### Important note

Please note that you will need to launch both the back and front ends at the same time (i.e. on different terminals) for the application to work as expected.

## License

Copyright (C) 2020 [Alberto Pérez de Rada Fiol](https://github.com/AlbertoPdRF)

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version. Please see [the LICENSE](./LICENSE.md) file in our repository for
the full text.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you have any questions, please email us at [support@tisn.app](mailto:support@tisn.app).

<div align="center">
  <br>
  <strong>Welcome and happy codding!</strong>
</div>
