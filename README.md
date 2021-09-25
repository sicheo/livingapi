
# livingapi
## Living API server
[![Repo](https://img.shields.io/badge/Repo-livingapi-blue)](https://github.com/sicheo/livingapi)

Real time server API for collaboration webapps based on [Convergence Server][convserv]

## Architecture

![NewPlatform-SW Arch](https://user-images.githubusercontent.com/66950550/134783203-1a1413eb-386e-4a60-98c5-47ab77ed0bb9.png)

The project consists of the following components
- **API Server library + API Server**: this server handles authentication and permissions through the JWT. It also ensures data persistence.
- **API Convergence Server library**: this library allows the interface with the Convergence Server (WebSocket real time api)
- **Client js library for Front End**: this library (webpack bundle) exports the Convapp object that the Front End application can import and use to access collaboration services

## Setup

First, clone the livingapi  repository from git:

```
git clone  https://github.com/sicheo/livingapi.git
```

Then, to install required node modules, invoke the following:

```
npm install
```
To build the api server:

```
npm run build
```

## Run the servers
To use the library in your web app you need two servers up and running

### Convergence Server
Run the Convergence Server with Admin Console and Orient DB. To start Convergence Server:
- See [here](https://github.com/convergencelabs/convergence-docker-compose) to start the server in production
- or use [this](https://github.com/convergencelabs/convergence-omnibus-container) for developmnet



### Api Server


## Features

- [Authentication/Authorization](#Authentication/Authorization): api for managing authentication and authorizations
- [Presence Service](#Presence): presence service management api
- [Shared activity](#Activity): api for mananging shared activity among users
- [Shared project](#Project): api for managing shared project artifacts
- [Chat](#Chat): chat api

### Authentication/Authorization

### Presence

### Activity

### Project

### Chat

[//]: # 

   [convserv]: <https://convergence.io/quickstart/>
  

