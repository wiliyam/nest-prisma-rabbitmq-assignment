## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript with prisma and rabbitmq.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# install dependencies
$ npm install

# start postgres and rabbitmq
$ docker-compose up -d

# migrate database
$ npx prisma migrate dev --name "init"

# seed database
$ npx prisma db seed

# start app
$ npm run start:dev
```


Its sending logs data and order data to rabbitmq queue and from queue logs is inserting on logs dir and order status is changing