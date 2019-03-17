function dragstart_handler(ev) {
     console.log("dragStart");
     // Change the source element's background color to signify drag has started
     // Add the id of the drag source element to the drag data payload so
     // it is available when the drop event is fired
     ev.dataTransfer.setData("text", ev.target.id);
     // Tell the browser both copy and move are possible
     ev.effectAllowed = "copyMove";
}
function dragover_handler(ev) {
     console.log("dragOver");
     // Change the target element's border to signify a drag over event
     // has occurred
     ev.preventDefault();
}
function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
      // Get the id of drag source element (that was added to the drag data
      // payload by the dragstart event handler)
    var id = ev.dataTransfer.getData("text");
      // Only Move the element if the source and destination ids are both "move"
    if (ev.target.id == "drop-area") {
        var img = document.getElementById("back-area").children;
        img[0].src = id;
        img[0].height = "400";
    }
}
function dragend_handler(ev) {
      // Remove all of the drag data
    ev.dataTransfer.clearData();
}