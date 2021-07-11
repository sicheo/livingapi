// Script for CONVERGENCE test

const convTest = (divelem) => {
    const x = document.getElementById(divelem)
    for (let i = 0; i < x.childNodes.length;i++)
        x.removeChild(x.childNodes[i]);
}