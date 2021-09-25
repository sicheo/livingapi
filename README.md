
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

In order to use JWT authorization with Convergence Server for a given domain, setup a JWT authentication for that domain with a public key, then generate a token using private key and the KeyId associated with public key.

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

- [Create new user digital twin](#Create): create new digital user and connect to Convergence Platform
- [Authentication/Authorization](#Authentication): api for managing authentication and authorizations
  - [Connection](#Connection): connect to Convergence Server
  - [Disconnection](#Disconnection): disconnects from Convergence Server
  - [User Search](#UserSearch): search user by name
  - [Search](#Search): serach users by query
  - [Group](#Group): get user group
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
window.ConvApp
```

### Create
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To create new digital user and connect to Convergence with JWT use:
```
        const baseapiurl = "http://<apiserver>:<apiport>/living/v1/convergence";
        const convergenceurl = "http://<convergenceserver>:<convergenceport>/api/realtime/convergence/living"

        const apiconn = new window.ConvApp.JwtApi(baseapiurl);

        const jwtconn = new window.ConvApp.JwtConnection(convergenceurl, apiconn);

        const userjwt = new window.ConvApp.Brouser("user@mail.com", jwtconn);
```
The instance *userjwt* now contains all the collaboration API. Each API call is asyncronous (returns a Promise). Each API call emits an event. The caller can listen to the event and will be notified when the call completes (or if an error occurs).

### Authentication
#### Connection
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To connect the user to Convergence Server use:
```
userjwt.connect({ user: "user@mail.com", password: "password" })
```
You can subscribe to the connection event using:
```
userjwt.emitter.on(Brouser.EVT_CONNECTED, async (res: any) => {
        ...do whatever you need to do...
    })
```
The res object returned by the event listerner is the following:
```
{
  domain: <domainId>
  session: <sessionId>
}
```
#### Disconnection
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To disconnect the user from Convergence Server use:
```
userjwt.disconnect()
```
You can subscribe to the disconnection event using:
```
userjwt.emitter.on(Brouser.EVT_DISCONNECTED, async (id: any ) => {
        ...do whatever you need to do...
    })
```
#### UserSearch
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get user info by username use:
```
userjwt.searchUser("user@mail.com")
```
You can subscribe to the user search event using:
```
userjwt.emitter.on(Brouser.EVT_SEARCHUSER, (user: any) => {
        ...do whatever you need to do...
    })
```
The user object returned by the event listener is the following:
```
{
  {"userType":"normal", 
  "username":"user@mail.com", 
  "firstName":"User First Name", 
  "lastName":"User Last Name", 
  "displayName":"User Display Name", 
  "email":"user@mail.com", 
  "anonymous":false, 
  "convergence":false, 
  "normal":true, 
  "userId":{"userType":"normal","username":"user@mail.com","_guid":"normal:user@mail.comu"}}
}
```
#### Search
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)


#### Group
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)


### Presence

### Activity

### Project

### Chat

[//]: # 

   [convserv]: <https://convergence.io/quickstart/>
  

