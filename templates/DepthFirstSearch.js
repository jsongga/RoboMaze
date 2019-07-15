// Depth First Search

// clear the driver object.
driver = {};
mouseLog = [];
// Gets called only when downloaded to the mouse
// Performs initialization
driver.load = function() {
    // Switches to a maze that can be solved
    // using wall following.
    //mouse.loadMaze("91japa1");
}

// Figure out next move.
// Gets called each iteration of the simulator.
driver.next = function() {
    //mouse.memSetData("1");
//    console.info(mouseLog)
    if (mouse.isPathLeft() && mouse.memGetVisitedLeft() == false) {
        mouse.left();
        mouse.fwd();
        mouse.right();
        mouseLog.push("W");
    } else if (mouse.isPathFwd() && mouse.memGetVisitedFwd() == false) {
        mouse.fwd();
        mouseLog.push("N");
    } else if (mouse.isPathRight() && mouse.memGetVisitedRight() == false) {
        mouse.right();
        mouse.fwd();
        mouse.left();
        mouseLog.push("E");
    } else if (mouse.isPathBack() && mouse.memGetVisitedBack() == false) {
        mouse.back();
        mouseLog.push("S") ;
    } else {
        switch (mouseLog.pop()) {
        case "N":
            mouse.back();
            break;
        case "E":
            mouse.left();
            mouse.fwd();
            mouse.right();
            break;
        case "W":
            mouse.right();
            mouse.fwd();
            mouse.left();
            break;
        case "S":
            mouse.fwd();
            break;
        }; //end switch


    }//end else
    if (allIsHome()) {
        //mouse.memPrintData();
        //mouse.memPrintMaze();
        stop();
        return;
    };

}
