
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
- or use [this](https://github.com/convergencelabs/convergence-omnibus-container) for development

In order to use JWT authorization with Convergence Server for a given domain, setup a JWT authentication for that domain with a public key, then genarte a token using private key and the KeyId associated with public key.

### Api Server
To start the API server, invoke the following:
```
npm run testsrv
```
The API server starts with cofiguration parameters in 
```
{
  "HOST": "<API server binding address>",
  "PORT": "<API Server port>",
  "HTTPS": "<HTTPS mode (NO|YES>",
  "LOGTYPE": "<logger mode (file|stdouy)>",
  "USER": "<API Server initial user>",
  "PASSWD": "<API Server initail passwd>",
  "JWT_SECRET": "<JWT secret>",
  "KEY_ID": "<Convergence Server key id>",
  "CONVHOST": "<Convergence Server host/ip>",
  "CONVPORT": "<Cpnvergence Server Port>"
}
```

## Features

- [Authentication/Authorization](#Authentication/Authorization): api for managing authentication and authorizations
- [Presence Service](#Presence): presence service management api
- [Shared activity](#Activity): api for mananging shared activity among users
- [Shared project](#Project): api for managing shared project artifacts
- [Chat](#Chat): chat api

To use the library in your webapp import the script:
```
<head>
    <meta charset="utf-8" />
    <title>Some title </title>
    <script src="script/dist/brouser.bundle.js"></script>
</head>
```
The API is accessible through the global object:
```
npm run testsrv
```

### Authentication/Authorization

### Presence

### Activity

### Project

### Chat

[//]: # 

   [convserv]: <https://convergence.io/quickstart/>
  

