/*
 CONVERGENCE JSON LIBRARY
 */


const _convergence_app = {
    connected: false,
    user: "",
    domain: undefined,
    status: "",
    subscriptions: [],
    buddies: []
}

export function _conv_connect(url,password){
    Convergence.connectWithPassword(url, { username: _convergence_app.user, password: password })
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
}

export function _conv_subscribe_presence(){
    const usernames = _convergence_app.buddies.map(user => user.username);
    if (_convergence_app.domain)
        _convergence_app.subscriptions = _convergence_app.domain.presence().subscribe(usernames)
    else
        console.log("Error subscribing status: not connected");
}


export function _conv_set_user(user){
    _convergence_app.user = user
}

export function _conv_get_user(){
    return(_convergence_app.user)
}

export function _conv_set_status(status){
    if (_convergence_app.domain)
        _convergence_app.domain.presence().setState("status", status);
    else
        console.log("Error setting status: not connected");
}

export function _conv_get_status(){
    if (_convergence_app.domain)
        return (_convergence_app.domain.presence().state().get("status"))
    else
        return (_convergence_app.status)
}

export function _conv_add_buddies(buddies){
    for (let i = 0; i < buddies.length; i++)
        _convergence_app.buddies.push(buddies[i])
}

export function _conv_remove_buddies(buddies){
    for (let i = 0; i < buddies.length; i++) {
        const removeIndex = _convergence_app.buddies.findIndex(item => item.name === buddies[i].name);
        // remove object
        _convergence_app.buddies.splice(removeIndex, 1);
    }
}

window._Convergence_app = _convergence_app;
