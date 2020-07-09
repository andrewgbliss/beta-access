# Local Development

## Installation

```
npm i
```

## Dev ops

### Environment

Copy the `sample.env` into an `.env` file.

### Start the database

```
docker-compose up
```

This will start postgres running in docker.

### Build the api dev server

```
npm run api:build
```

### Run migrations

```
npm rum migrate
```

### Run seeder

```
npm rum seed
```

## Development

### Start the api dev server

```
npm run api:dev
```

### Start the client frontend

```
npm run client:start
```

## Building

### Build the client frontend

```
npm run client:build
```

### Build the api dev server

```
npm run api:build
```

### Build everything

```
npm run build
```
