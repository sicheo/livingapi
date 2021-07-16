// Script for CONVERGENCE test

import * as conv from  './script/conv.js';

export function _presence_convTest(divelem){
    const x = document.getElementById(divelem)
    for (let i = 0; i < x.childNodes.length;i++)
        x.removeChild(x.childNodes[i]);
}

// change presence status
// possible values:
//      offline:            user don't subscribe domain
//      online available:   user subcribe domain with indicator available
//      online away:        user subcribe domain with indicator away
//      online dnd:         user subcribe domain with indicator do not disturb

export function _presence_fnChangePresence(newstatus){
    const img = document.getElementById("imgpresence")
    let src = "https://127.0.0.1:3132/img/"
    switch (newstatus) {
        case "available":
            src +="circlegreen.png"
            break;
        case "away":
            src += "circleyellow.png"
            break;
        case "dnd":
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
export function _presence_fnChangeBuddyList(){
    let src = "https://127.0.0.1:3132/img/"
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
    if (_Convergence_app.buddies) {
        for (let i = 0; i < _Convergence_app.buddies.length; i++) {
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
            switch (_Convergence_app.buddies[i].status) {
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
                case "offline":
                default:
                    buddyliclass = "offline"
                    buddyspanimgsrc = src + "circlegrey.png"
                    break
            }
            // add image to spanimg
            buddyspanimg.className = buddyspanimgclass
            const img = document.createElement('img');
            img.className = "buddy-presence"
            img.src = buddyspanimgsrc
            buddyspanimg.appendChild(img)


            // add name to spanname
            buddyspanname.className = buddyspannameclass
            const t = document.createTextNode(_Convergence_app.buddies.name);
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

export function _presence_fnInizialize(){
    // Get buddylist names from repository
    const token = document.getElementById("_token_").value

    // Get buddylist from convergence server
}


