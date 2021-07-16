// CONV
const _convergence_app = {
    connected: false,
    user: "",
    domain: undefined,
    status: "",
    online: false,
    subscriptions: [],
    subscription: undefined,
    buddies: []
}

function _conv_connect(url, user, password) {
    return new Promise((resolve, reject) => {
    Convergence.connectWithPassword(url, { username: user, password: password })
        .then(d => {
            _convergence_app.connected = true
            _convergence_app.domain = d
            console.log("Connected to convergence");
            return (d)
        })
        .catch(error => {
            console.log("Error connecting", error);
            return (error)
        });
    })
}

function _conv_connect_jwt(url, token) {
    Convergence.connectWithJwt(url, token, { protocol: { defaultRequestTimeout:20}})
        .then(d => {
            _convergence_app.connected = true
            _convergence_app.domain = d
            console.log("Connected to convergence JWT");
            return (d)
        })
        .catch(error => {
            console.log("Error connecting", error);
            return (error)
        });
}

function _conv_connect_anon(url) {
    return new Promise((resolve, reject) => {
        Convergence.connectAnonymously(url)
            .then(d => {
                _convergence_app.connected = true
                _convergence_app.domain = d
                console.log("Connected to convergence Anon");
                resolve (d)
            })
            .catch(error => {
                console.log("Error connecting", error);
                reject (error)
            });
    })
}

function _conv_subscribe_presence(usernames) {
    console.log(usernames)
    return new Promise((resolve, reject) => {
        if (_convergence_app.domain) {
            _convergence_app.domain.presence().subscribe(usernames)
                .then((subscriptions) => {
                    _convergence_app.buddies = subscriptions
                    console.log("*********** SUBSCRIPTIONS **********")
                    console.log(_convergence_app.buddies)
                    _convergence_app.domain.presence().on(Convergence.PresenceService.Events.STATE_SET, (evt) => {
                        if (evt.state.has("status")) {
                            _convergence_app.status = evt.state.get("status");
                        }
                    });
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        }  
        else
            reject("Error subscribing status: not connected");
    })
}


function _conv_set_user(user) {
    _convergence_app.user = user
}

function _conv_get_user() {
    return (_convergence_app.user)
}

function _conv_set_status(status) {
    if (_convergence_app.domain)
        _convergence_app.domain.presence().setState("status", status);
    else
        console.log("Error setting status: not connected");
}

function _conv_get_status() {
    if (_convergence_app.domain)
        return (_convergence_app.domain.presence().state().get("status"))
    else
        return (_convergence_app.status)
}

function _conv_add_buddies(buddies) {
    for (let i = 0; i < buddies.length; i++)
        _convergence_app.buddies.push(buddies[i])
}

function _conv_remove_buddies(buddies) {
    for (let i = 0; i < buddies.length; i++) {
        const removeIndex = _convergence_app.buddies.findIndex(item => item.name === buddies[i].name);
        // remove object
        _convergence_app.buddies.splice(removeIndex, 1);
    }
}




// presence

function _presence_convTest(divelem) {
    const x = document.getElementById(divelem)
    for (let i = 0; i < x.childNodes.length; i++)
        x.removeChild(x.childNodes[i]);
}

// change presence status
// possible values:
//      offline:            user don't subscribe domain
//      online available:   user subcribe domain with indicator available
//      online away:        user subcribe domain with indicator away
//      online dnd:         user subcribe domain with indicator do not disturb

function _presence_fnChangePresence(newstatus) {
    _convergence_app.status = newstatus
    const img = document.getElementById("imgpresence")
    let src = "http://127.0.0.1:3132/img/"
    switch (newstatus) {
        case "available":
            _convergence_app.domain.presence().setState("status", newstatus)
            src += "circlegreen.png"
            break;
        case "away":
            _convergence_app.domain.presence().setState("status", newstatus)
            src += "circleyellow.png"
            break;
        case "dnd":
            _convergence_app.domain.presence().setState("status", newstatus)
            src += "circlered.png"
            break
        case "offline":
        default:
            src += "circlegrey.png"
            break;
    }
    img.src = src
}

// show/hide buddy-list
function _presence_fnChangeBuddyList() {
    let src = "http://127.0.0.1:3132/img/"
    const x = document.getElementById("jumbotron_id")
    // remove childrens
    for (let i = 0; i < x.childNodes.length; i++)
        x.removeChild(x.childNodes[i]);
    // create buddy list div
    const buddylistdiv = document.createElement("div")
    buddylistdiv.className = "buddy-list"
    // create buddy list header
    const buddylistheader = document.createElement("div")
    buddylistheader.className = "buddy-list-header"
    const t = document.createTextNode("Buddy list");
    buddylistheader.appendChild(t)
    // create buddy ul
    const buddyul = document.createElement("ul")
    buddyul.className = "buddies"
    // create and append buddy li
    if (_convergence_app.buddies) {
        for (let i = 0; i < _convergence_app.buddies.length; i++) {
            // li element
            const buddyli = document.createElement("li")
            let buddyliclass = "offline"
            // span img element
            const buddyspanimg = document.createElement("span")
            let buddyspanimgclass = "dnd"
            let buddyspanimgsrc = src + "circlegrey.png"
            // span display name element
            const buddyspanname = document.createElement("span")
            let buddyspannameclass = "display-name"
            console.log(_convergence_app.buddies[i].available + ' ' + _convergence_app.buddies[i].state.get("status"))
            if (_convergence_app.buddies[i].user.displayName+' '+_convergence_app.buddies[i].available) {
                switch (_convergence_app.buddies[i].state.get("status")) {
                    case "available":
                        buddyliclass = "online"
                        buddyspanimgclass = "available"
                        buddyspanimgsrc = src + "circlegreen.png"
                        break;
                    case "away":
                        buddyliclass = "online"
                        buddyspanimgclass = "away"
                        buddyspanimgsrc = src + "circleyellow.png"
                        break;
                    case "dnd":
                        buddyliclass = "online"
                        buddyspanimgclass = "dnd"
                        buddyspanimgsrc = src + "circlered.png"
                        break;
                    default:
                        buddyliclass = "offline"
                        buddyspanimgsrc = src + "circlegrey.png"
                        break
                }
            } else {
                buddyliclass = "offline"
                buddyspanimgsrc = src + "circlegrey.png"
            }
            // add image to spanimg
            buddyspanimg.className = buddyspanimgclass
            const img = document.createElement('img');
            img.className = "buddy-presence"
            img.src = buddyspanimgsrc
            buddyspanimg.appendChild(img)


            // add name to spanname
            buddyspanname.className = buddyspannameclass
            const t = document.createTextNode(_convergence_app.buddies[i].user.displayName);
            buddyspanname.appendChild(t)

            buddyli.className = buddyliclass
            buddyli.appendChild(buddyspanimg)
            buddyli.appendChild(buddyspanname)

            buddyul.appendChild(buddyli)
        }
    }
    // append header ad ul to buddy list
    buddylistdiv.appendChild(buddylistheader)
    buddylistdiv.appendChild(buddyul)
    // append buddy list to jumbotron
    x.appendChild(buddylistdiv)
}

function  _presence_fnInizialize() {
    // Get buddylist names from repository
    const token = document.getElementById("_token_").value
    const user = document.getElementById("_user_").value

    const url = "http://192.168.1.70:80/api/realtime/convergence/living"
    // Connect to Convergence with ANON please correct this one
    _conv_connect_anon(url)
        .then((d) => {

            if (!_convergence_app.domain.presence().state().has("status")) {
                _convergence_app.domain.presence().setState("status", "available");
            }
            // get buddylist from repository
            const headers = {
                'Authorization': 'Bearer '+token
            }
            const axurl = 'http://127.0.0.1:3132/living/v1/convergence/buddies/'+user
            axios.get(axurl, { headers })
                .then((response) => {
                    const usernames = []
                    console.log("************ SUBSCRIBE **************")
                    for (let i = 0; i < response.data.length; i++)
                        usernames.push(response.data[i].buddy)
                    if (response.data.length > 0)
                        usernames.push(response.data[0].user)
                    return _conv_subscribe_presence(usernames);
                })
                .catch((err) => {
                    console.log("***** AXIOS ERROR ****")
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log("***** ERROR ****")
            console.log(err)
        })
}



