// Script for CONVERGENCE test

const convTest = (divelem) => {
    const x = document.getElementById(divelem)
    for (let i = 0; i < x.childNodes.length;i++)
        x.removeChild(x.childNodes[i]);
}

// change presence status

const fnChangePresence = (newstatus) => {
    const img = document.getElementById("imgpresence")
    let src = "https://127.0.0.1:3132/img/"
    switch (newstatus) {
        case "available":
            src +="circlegreen.png"
            break;
        case "away":
            src += "circleyellow.png"
            break;
        case "ndisturb":
            src += "circlered.png"
            break
    }
    img.src = src
}