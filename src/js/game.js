'use strict';
$(document).ready(function () {
    // making the board a square
    var boardWidth = $("#board").width();
    $("#main_grid").height(boardWidth);

    // making the control panel a square
    var controlPanelWidth = $("#control_panel").width();
    document.documentElement.style.setProperty("--control_panel_height", "" + controlPanelWidth + "px");

    // moving the arrows to the center of buttons (div)
    var buttonHeight = $("#move_up").height();
    $("span.arrow").css({
        "line-height": "" + buttonHeight + "px"
    });
});