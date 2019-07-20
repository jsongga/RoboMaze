run = function() {
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
        }; //Switch
    }//Else
    if (allHome()) {
        stop();
        return;
    };

}
