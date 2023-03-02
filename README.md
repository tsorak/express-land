# express-land

## How to use

Create a .env file in the root directory

```env
AUTH_SECRET="SUPER-SECRET-VALUE"
```

## Running

```sh
npm install
```

```sh
npm run dev
```

## Routes

### GET /?land=STRING

Get info about a specific country

### GET /lands

Returns an array of all countries in the database

### POST /

Add a Land to the database using the following format:

```json
{
    "name": "norge",
    "population": 1000,
    "capital": "Köpenhamn",
    "language": "norska"
}
```

### PATCH /

Edit an existing Land in the database. Name is required, the rest is optional.

### DELETE /

Delete a country from the database. Name is required.
