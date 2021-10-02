
# livingapi
## Living API server
[![Repo](https://img.shields.io/badge/Repo-livingapi-blue)](https://github.com/sicheo/livingapi)

Real time server API for collaboration webapps based on 

[<h3>Convergence Server</h3>][convservgit]

[<img alt="Convergence Logo" height="80" src="https://convergence.io/assets/img/convergence-logo.png" >][convserv] 

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

## Usage

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
## Features

- [Create new user digital twin](#Create): create new digital user and connect to Convergence Platform
- [Authentication/Authorization](#Authentication): api for managing authentication and authorizations
  - [Connection](#Connection): connect to Convergence Server
  - [Disconnection](#Disconnection): disconnects from Convergence Server
  - [User Search](#UserSearch): search user by name
  - [Search](#Search): search users by query
  - [Group](#Group): get user group
- [Presence Service](#Presence): presence service management api
  - [Subscribe](#Subscribe): subscribe to get presence event notification
  - [Set Presence Status](#SetPresence): set presence status
  - [Unsubscribe](#Unsubscribe): unsubscribe presence event notification
- [Shared activity](#Activity): api for managing shared activity among users
  - [Join/Create Avtivity](#JoinActivity): join an activity (create if not existent)
  - [Leave Activity](#LeaveActivity): leave an activity
  - [Get Participants](#GetParticipants): get the activity participants
  - [Remove Activity](#RemoveActivity): remove the activity
  - [Set Activity State](#SetActivityState): set an activity state
  - [Get Activity State](#GetActivityState): get the value of an activity state
  - [Remove Activity State](#RemoveActivityState): remove an activity state
  - [Clear Activity State](#ClearActivityState): clear all activity states
  - [Set Activity Permissions](#SetActivityPermissions): set the activity permissions
  - [Get Activity Permissions](#GetActivityPermissions): get the activity permissions
- [Shared project](#Project): api for managing shared project artifacts
- [Chat](#Chat): chat api
  - [Create Chat Room](#CreateChatRoom): create a chat room
  - [Create Chat Channel](#CreateChatChannel): create a chat channel
  - [Create Chat Direct](#CreateChatDirect): create a chat direct
  - [Remove Chat](#ChatRemove): remove a chat
  - [Join Chat](#ChatJoin): join a chat
  - [Send a Message](#ChatSend): send a message to the chat
  - [Add Users to a Channel](#ChatAdd): add users to a chat channel
  - [Leave Chat](#ChatLeave): leave a chat
  - [Change Chat Name](#ChatChangeName): change chat name
  - [Change Chat Topic](#ChatChangeTopic): change chat topic
  - [Get Chat Info](#ChatGetInfo): get chat info


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
The ```res``` object returned by the event listerner is the following:
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
The ```user``` object returned by the event listener is the following:
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

To get user info by query use:
```
const query = { fields: ['firstName', 'lastName'], term: 'searchterm', offset: 0, limit: 10, orderBy: { field: 'lastName', ascending: true } }
await userjwt.search(query)
```
You can subscribe to the user search event using:
```
userjwt.emitter.on(Brouser.EVT_SEARCH, (users: any) => {
        ...do whatever you need to do...
    })
```
The ```users``` returned by the event listener is an array of ```user``` objects:
```
[{
  {"userType":"normal", 
  "username":"user1@mail.com", 
  "firstName":"User1 First Name", 
  "lastName":"User1 Last Name", 
  "displayName":"User1 Display Name", 
  "email":"user1@mail.com", 
  "anonymous":false, 
  "convergence":false, 
  "normal":true, 
  "userId":{"userType":"normal","username":"user1@mail.com","_guid":"normal:user1@mail.comu"}}
},
{
  {"userType":"normal", 
  "username":"user2@mail.com", 
  "firstName":"User2 First Name", 
  "lastName":"User2 Last Name", 
  "displayName":"User2 Display Name", 
  "email":"use2r@mail.com", 
  "anonymous":false, 
  "convergence":false, 
  "normal":true, 
  "userId":{"userType":"normal","username":"user2@mail.com","_guid":"normal:user2@mail.comu"}}
}]
```

#### Group
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get group info use:
```
userjwt.getGroup()
```
You can subscribe to the get group event using:
```
userjwt.emitter.on(Brouser.EVT_GETGROUP, (group: any) => {
        ...do whatever you need to do...
    })
```
The ```group``` object returned by the event listener is the following:
```
{
"id":"GroupId",
"description":"Group Description",
"members":["user1@mail1.com","user2@mail2.com","user3@mail3.com"]
}
```

### Presence

#### Subscribe
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To subscribe to userlist (buddies) events use:
```
userjwt.subscribe()
```
You can get presence state change event using:
```
userjwt.emitter.on(Brouser.EVT_PRESENCESTATE, (ret: any) => {
        ...do whatever you need to do...
    })
```
The ```ret``` object returned by the event listerner is the following:
```
{
  evt: "status_set"
  state: "offline"|"available"|"dnd"|"away"
}
```
#### SetPresence
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To change the presence status of the user use:
```
userjwt.status = "available"|"dnd"|"away"
```

#### Unsubscribe
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To unsubscribe to userlist (buddies) events use:
```
userjwt.unsubscribeAll()
```

### Activity

#### JoinActivity
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To join an existing activity (or create if it doesn't exists) use:
```
userjwt.joinActivity("<activity-type>", "<activity-id>")
```
***You can join only one activity at time. You need to leave the activity if you want to join another one***
You can subscribe to the join activity event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSESSIONJOINED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is the following:
```
{
  participant: joined participant object
}
```
The ```participant``` object is as follows:
```
{
  activity: The Activity this participant belongs too.
  sessionId: The session id of the participant.
  user: The username of the participant.
  local: A flag indicating if the participant represents the local user / session.
  state: The state of this participant within the activity.
}
```
#### LeaveActivity
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To leave an existing activity use:
```
userjwt.leaveActivity()
```
You can subscribe to the leave activity event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSESSIONLEFT, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is the following:
```
{
  activity: The Activity this participant belongs too.
  user: The username of the participant.
  sessionId: The session id of the participant.
}
```
#### GetParticipants
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get the list of activity participants use:
```
userjwt.getParticipants()
```
You can subscribe to the get activity participants event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYGETPARTICIPANTS, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is the an array of ```participant``` objects:
```
[
  participant1, participant2, participant3
]
```

#### RemoveActivity
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To remove an activity use (you must have permission to remove):
```
userjwt.removeActivity()
```
You can subscribe to the remove activity event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYDELETED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  activity: The Activity deleted.
  user: The username.
  sessionId: The session id.
}
```
#### SetActivityState
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To set an activity state use:
```
userjwt.setActivityState("<state name>", "<state value>")
```
You can subscribe to the set activity state event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATESET, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  activity: The Activity this participant belongs too.
  sessionId: The session id of the participant.
  user: The username of the participant.
  local: A flag indicating if the participant represents the local user / session.
  state: The state of this participant within the activity.
  key: the state that was modified.
  value: the value of the state.
}
```

#### GetActivityState
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get an activity state use:
```
const res = userjwt.getActivityState("<state name>")
```
The ```res``` object returned is a string with the state value.


#### RemoveActivityState
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To remove an activity state use:
```
userjwt.removeActivityState("<state name>")
```
You can subscribe to the remove activity state event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATEREMOVED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  activity: The Activity this participant belongs too.
  sessionId: The session id of the participant.
  user: The username of the participant.
  local: A flag indicating if the participant represents the local user / session.
  state: The state of this participant within the activity.
  key: the state that was removed
}
```

#### ClearActivityState
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To remove all the activity states use:
```
userjwt.clearActivityState()
```
You can subscribe to the clear activity state event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATECLEARED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  activity: The Activity this participant belongs too.
  sessionId: The session id of the participant.
  user: The username of the participant.
  local: A flag indicating if the participant represents the local user / session.
  state: The state of this participant within the activity.
}
```

#### SetActivityPermissions
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To set activity permissions use:
```
// For group
const perms = { "<GroupName>": ["join", "lurk", "view_state", "set_state"] }
userjwt.setActivityPermissions("group", perms)
// for user
const perms = { "<UserName>": ["join", "lurk", "set_state", "view_state", "manage", "remove"] }
userjwt.setActivityPermissions("user", perms)
// for everyone
const perms = { "world": ["join", "lurk", "view_state"] }
userjwt.setActivityPermissions("world", perms)
```
You can subscribe to the set activity state permissions event using:
```
userjwt.emitter.on(Brouser.EVT_ACTIVITYSETPERMISSIONS, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  type: permission type.
  permissions: permissions setted
}
```

#### GetActivityPermissions
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get activity permissions use:
```
const ret = userjwt.getActivityPermissions("<type>")
```
The ```ret``` object returned is an array of string of permissions.

### Project

TBD

### Chat

#### CreateChatRoom
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To create a chat room use:
```
userjwt.createRoomChat("ROOM_NAME", "ROOM_TOPIC")
```

#### CreateChatChannel
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To create a chat channel use:
```
userjwt.createChannelChat("CHANNEL_NAME", "CHANNEL_TOPIC")
```

#### CreateChatDirect
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To create a chat Direct with *user1@mail.com*, *user2@mail2.com*, use:
```
userjwt.createDirectChat(["user1@mail.com", "user2@mail2.com"])
```
#### ChatRemove
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To remove a chat  use:
```
userjwt.chatRemove("CHAT_NAME")
```
You can subscribe to the chat remove event using:
```
userjwt.emitter.on(Brouser.EVT_CHATREMOVED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  cahtId: chat Id
}
```

#### ChatJoin
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To join a chat  use:
```
userjwt.chatJoin("CHAT_NAME")
```
You can subscribe to the chat join event using:
```
userjwt.emitter.on(Brouser.EVT_CHATJOIN, async (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  cahtId: chat Id
}
```

#### ChatSend
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To send a message to a chat room or a chat channel  use:
```
userjwt.chatSend("CHAT_NAME","This is my message")
```
To send a message to a direct chat room   use:
```
userjwt.chatSend("CHAT_NAME","This is my message", true)
```
You can subscribe to the chat send event using:
```
userjwt.emitter.on(Brouser.EVT_CHATMESSAGE, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  message: message sent to the chat
}
```

#### ChatAdd
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To add a user to a chat channel  use:
```
userjwt.chatSend("CHAT_NAME","user1@mail.com")
```
You can subscribe to the chat user add event using:
```
userjwt.emitter.on(Brouser.EVT_CHATUSERADDED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  user: user added to the chat
}
```

#### ChatLeave
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To leave a chat use:
```
userjwt.chatLeave("CHAT_NAME")
```
You can subscribe to the chat leave event using:
```
userjwt.emitter.on(Brouser.EVT_CHATLEFT, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  cahtId: chat Id
}
```


#### ChatChangeName
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To change tha chat name use:
```
userjwt.chatChangeName("CHAT_NAME","NEW_CHAT_NAME")
```
You can subscribe to the chat change name event using:
```
userjwt.emitter.on(Brouser.EVT_CHATNAMECHANGED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  cahtName: new chat name
}
```

#### ChatChangeTopic
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To change tha chat name use:
```
userjwt.chatChangeTopic("CHAT_TOPIC","NEW_CHAT_TOPIC")
```
You can subscribe to the chat change topic event using:
```
userjwt.emitter.on(Brouser.EVT_CHATTOPICCHANGED, (res: any) => {
        ...do whatever you need to do...
    })
```
The ```res``` object returned by the event listerner is:
```
{
  topic: new chat topic
}
```

#### ChatGetInfo
[![codecov](https://img.shields.io/static/v1?label=navigation&message=up&color=yellow)](#Features)

To get tha chat info use:
```
userjwt.chatGetInfo("CHAT_NAME")
```


[//]: # 

   [convserv]: <https://convergence.io/quickstart/>
   [convservgit]: <https://github.com/convergencelabs/convergence-server>
  

