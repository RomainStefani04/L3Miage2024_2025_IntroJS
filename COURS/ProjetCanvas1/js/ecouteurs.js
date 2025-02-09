function initListeners(inputStates, canvas) {
    window.onkeydown = (event) => {
        console.log("Touche pressée : " + event.key);
        if(event.key === "ArrowRight") {
            inputStates.ArrowRight = true;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = true;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = true;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = true;
        }
        if (event.key === "z" || event.key === "Z") {
            inputStates.z = true;
        }
        if (event.key === "s" || event.key === "S") {
            inputStates.s = true;
        }
        if (event.key === "q" || event.key === "Q") {
            inputStates.q = true;
        }
        if (event.key === "d" || event.key === "D") {
            inputStates.d = true;
        }
    }

    window.onkeyup = (event) => {
        console.log("Touche relachée : " + event.key);
        if(event.key === "ArrowRight") {
            inputStates.ArrowRight = false;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = false;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = false;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = false;
        }
        if (event.key === "z" || event.key === "Z") {
            inputStates.z = false;
        }
        if (event.key === "s" || event.key === "S") {
            inputStates.s = false;
        }
        if (event.key === "q" || event.key === "Q") {
            inputStates.q = false;
        }
        if (event.key === "d" || event.key === "D") {
            inputStates.d = false;
        }
    }

    window.onmousemove = (event) => {
        // get proper x and y for the mouse in the canvas
        inputStates.mouseX = event.clientX - canvas.getBoundingClientRect().left;
        inputStates.mouseY = event.clientY - canvas.getBoundingClientRect().top;
    }
}

export { initListeners };