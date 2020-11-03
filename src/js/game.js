'use strict';
var numBlockWidth = 0;
var numBlockHeight = 0;
var boardPadding = 0;
var boardOriginX = 0;
var boardOriginY = 0;
var blockCreationCounter = 0;
const numToColor = {
    2: "#FFB440",
    4: "#FFBC73",
    8: "#FF9900",
    16: "salmon",
    32: "lightsalmon",
    64: "coral",
    128: "tomato",
    256: "darkorange",
    512: "orange",
    1024: "#FF8500",
    2048: "gold"
}

$(document).ready(function () {
    // making the board a square
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

    // filling in the background blocks of the board
    for (var i = 0; i < 16; i++) {
        var block = document.createElement("div");
        block.classList.add("block");
        $(block).css({
            "grid-area": "block" + i
        })
        $("#board").append(block);
    }

    // setting the width and height for num_block created in the future
    // and also the padding length of the board
    numBlockWidth = $("div.block").first().width();
    numBlockHeight = $("div.block").first().height();
    boardPadding = ($("#board").innerWidth() - $("#board").width()) / 2;
    // finding out the origin for the board's coordinates
    boardOriginX = boardPadding;
    boardOriginY = boardPadding;

    addNumBlock(0, 0, 2048);
    addNumBlock(1, 0, 1024);
    addNumBlock(2, 0, 512);
    addNumBlock(3, 0, 256);
    addNumBlock(0, 1, 128);
    addNumBlock(1, 1, 64);
    addNumBlock(2, 1, 32);
    addNumBlock(3, 1, 16);
    addNumBlock(0, 2, 8);
    addNumBlock(1, 2, 4);
    addNumBlock(2, 2, 2);
});

function addNumBlock(x, y, value) {
    /* x, y are integers, indicating the index on x and y coordinates */
    var numBlock = document.createElement("div");
    numBlock.classList.add("num_block");
    numBlock.setAttribute("id", "num_block_" + blockCreationCounter);
    numBlock.innerHTML = value.toString();
    $(numBlock).css({
        "width": "" + numBlockWidth + "px",
        "height": "" + numBlockHeight + "px",
        "line-height": "" + numBlockHeight + "px",
        "font-size": "" + numBlockHeight * 0.3 + "px",
        "left": "" + (boardOriginX + x * (numBlockWidth + boardPadding)) + "px",
        "top": "" + (boardOriginY + y * (numBlockHeight + boardPadding)) + "px",
        "background-color": numToColor[value]
    })
    console.log(x);
    console.log(y);
    console.log(value);
    $("#board").append(numBlock);
}