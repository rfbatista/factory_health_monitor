# Requirements

1. yarn
2. docker or a postgres database
3. node 18.3

# How to use

1. set environment variables

```sh
DATABASE_URL="postgresql://admin:123@localhost:5432/machines?schema=public"
IDENTITY_TOKEN_KEY=key3
REFRESH_TOKEN_KEY=key2
ACCESS_TOKEN_KEY=key1
PASSWORD_SALT=salted
```

2. install dependencies

```sh
yarn install
```

4. Setup database

```sh
docker compose up --build -d
```

5. Run migrations

```sh
yarn prisma:migrate
```

6. Run application

```sh
yarn start
```

# Application Architecture

The architeture for this application is based on Hexagonal Architecture, it brings responsibility segregation and make it easier to evolve the architecture as business rule change, that is why I choose to go with this.

()[./architecture.png]

```
├── app.ts              Application entrypoint
├── controllers         REST Controllers
├── dtos                Data transfer objects
├── entities            Application entities: encapsulate business logics and resource representation
├── usecases            Application usecases: encapsulate business logics and resources managment 
├── errors.ts           A map of applications errors 
├── infrastructure      Application adapter: databases, loggers, events e etc
├── ports               Ports are interface that stabilish a contract beetween parts of the system
├── repositories        Isolate datalayer from the rest of application
└── shared              Some concepts that are shared across the application, Ex.: User session
```

# Authentication and Authorization

You need to log in the application to grant access to other endpoints. First create a user:
```
/api/v1/user/create
{
  "email": "teste@teste.com",
  "password": "teste"
} 
```
After the user is created you can log in the application:
```
/api/v1/auth/signin
{
  "email": "teste@teste.com",
  "password": "teste"
}
```

You will receive three different types of JWT tokens.
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTcwMjI3MDU3NCwiZXhwIjoxNzAyMjc3Nzc0fQ.d4k_ayo5hLvcXvlfAPq5n98N9ZIml9ICwP8VwrIAuOE",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTcwMjI3MDU3NCwiZXhwIjoxNzAyMjgxMzc0fQ.-kZ1I9Q0Q437siseocffC1TujBOCe4IjaG4r6IidZ2M",
  "identityToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTcwMjI3MDU3NCwiZXhwIjoxNzAyMjc3Nzc0fQ._Dh1g-uZJNqZ39hVIj5PitYvhsymIGGEKUOGwZBQHEM"
}
```

The *accessToken* you have to send in the *Authorization* header as *Bearer* token.
The accessToken have a limited life time, at this time the api will return a 401 HTTP status code, to renew you need to use the *refreshToken*
```
/api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTcwMjI3MDU3NCwiZXhwIjoxNzAyMjgxMzc0fQ.-kZ1I9Q0Q437siseocffC1TujBOCe4IjaG4r6IidZ2M",
}
```

# Some next steps:

- Improve error handling and mapping
- Transform machine health calculation as a UseCase that use entities to do its logic
- Improve the logger service
- Configure the dynamic open api with help of decorator in controllers and DTOs
- Invert all dependency injection, to give a more loose coupling
- Add debuger script
