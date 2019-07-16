run = function() {
    if (allIsHome()) {
        mouse.stop();
        return;
    }

    // priority: right, fwd, left	
    if (mouse.isPathRight()) {
          mouse.right();
          mouse.fwd();
    } else if (mouse.isPathFwd()) {
        mouse.fwd();
    } else {
        mouse.left();
        mouse.fwd();
    }
}


