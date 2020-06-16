<div align="center">
  <br>
  <img alt="Tisn" src="./client/public/logo192.png">
  <h1>Tisn - The introverts' social network</h1>
  <strong>Meet people while doing what you enjoy!</strong>
</div>

## Table of Contents

- [What is tisn.app?](#what-is-tisnapp)
- [Contributing](#contributing)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Back end (or API)](#back-end-or-api)
  - [Front end (or client)](#front-end-or-client)
  - [Important note](#important-note)
- [License](#license)

## What is tisn.app?

Welcome to the [tisn.app](https://tisn.app/) (or just Tisn) repository! We are very glad to have you here. If you want to help us make Tisn better, this is definitely the place to be!

The primary objective of Tisn is to try and address the problem of the apparent difficulty that exists to meet people and make new friends on this modern world. To do that, our social network:

1. Connects people according to their interests
2. Encourages people to go outside and meet others while doing something that they all enjoy
3. It's as simple as possible

We try to do all of that while being completely transparent and respecting our users' privacy.

## Contributing

We encourage you to contribute to tisn.app! We haven't stablished clear guidelines and processes yet, but please keep in mind [contribution best practices](https://opensource.guide/how-to-contribute/) if you want to get involved.

## Getting started

Clone the repository:

```bash
git clone https://github.com/tisn/tisn.app.git
cd tisn.app
```

We recommend [setting up an SSH key](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and clonning the repository with the command `git clone git@github.com:tisn/tisn.app.git` instead.

### Prerequisites

- [Node.js](https://nodejs.org/) version 12.x

We recommend using [nvm](https://github.com/nvm-sh/nvm/) to install and manage Node versions.

### Back end (or API)

Install all the dependencies and launch the back end executing the following commands from the repository's root folder:

```bash
cd api
npm install
npm start
```

We recommend installing [nodemon](https://nodemon.io/) globally (i.e. `npm install -g nodemon`) and launching the server with the command `npm run start:dev` instead.

Also, a `.env` file with the following secrets is necessary:

```bash
DB_URL=""
JWT_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
SENDGRID_API_KEY=""
BASE_CLIENT_URL=""
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
