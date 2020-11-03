'use strict';
$(document).ready(function () {
    // making the board a square
    console.log($("#board").width());
    console.log($("#board").height());
    var boardWidth = $("#board").width();
    var boardHeight = $("#board").height();
    if (boardWidth <= boardHeight) {
        $("#main_grid").height(boardWidth);
    } else {
        document.documentElement.style.setProperty("--board_width", "" + boardHeight + "px");
        document.documentElement.style.setProperty("--grid_padding", "auto");
    }


    // making the control panel a square
    var controlPanelWidth = $("#control_panel").width();
    document.documentElement.style.setProperty("--control_panel_height", "" + controlPanelWidth + "px");

    // moving the arrows to the center of buttons (div)
    var buttonHeight = $("#move_up").height();
    $("span.arrow").css({
        "line-height": "" + buttonHeight + "px"
    });
});