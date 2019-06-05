driver = {};
driver.load = function() {
    // Switches to a maze that can be solved
    // using wall following.
    //mouse.loadMaze("91japa1");
}
driver.next = function() {
    if (mouse.isGoal()) {
        alert("Center Reached!\nMoves: "+mouse.moveCount());
        mouse.stop();
        return;
    }
    //code goes here
};
