run = function() {
    // priority: left, fwd, right	
    if (mouse.isPathLeft()) {
        mouse.left();
        mouse.fwd();
    } else if (mouse.isPathFwd()) {
        mouse.fwd();
    } else {
        mouse.right();
        mouse.fwd();
    }

}

