# Requirements

1. yarn
2. docker or a postgres database
3. node 18.3
4. expo cli

# How to use

1. set environment variables

```sh
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.143:3001
```

2. install dependencies

```sh
yarn install
```

3. Run application

```sh
yarn start
```

# Application Architecture

```
├── entities            Application entities: encapsulate business logics and resource representation
├── infrastructure      Application adapter: http clients, etc
├── components          Contains reusable components used throughout the app.
├── app                 Screend and tabs
├── data                Stores JSON files with machine and part data for evaluation
└── shared              Some concepts that are shared across the application, Ex.: User session
```
