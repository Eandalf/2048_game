(function () {
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
    const genValueThreshold = 0.66; // [0,1)
    var board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var boardBlockId = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var score = 0;
    var best = 0;
    var gameWon = false;
    var gameStuck = false;

    $(document).ready(function () {
        initializeLayout();
        initializeBoard();
        registerButtons();
        registerKeyboards()
        initializeBest();
        $("div.wall").hide();
    });

    function initializeLayout() {
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
    }

    function initializeBoard() {
        generateRandomNumBlock();
    }

    function generateRandomNumBlock() {
        var spaceCount = 0;
        var board_blank = findSpace();
        board_blank.forEach(function (row) {
            spaceCount += row.reduce((a, b) => a + b, 0);
        });

        var numToGen = 0;
        if (spaceCount > 10) {
            numToGen = 3;
        } else if (spaceCount > 5) {
            numToGen = 2;
        } else if (spaceCount > 0) {
            numToGen = 1;
        } else if (spaceCount == 0) {
            gameStuck = true;
        }

        var positions = [];
        while (positions.length < numToGen) {
            var r = Math.floor(Math.random() * spaceCount);
            if (positions.indexOf(r) === -1) positions.push(r);
        }

        positions.forEach(function (position) {
            var coordinates = positionToXY(position, board_blank);
            var x = coordinates[0];
            var y = coordinates[1];

            var value = Math.pow(2, (Math.random() > genValueThreshold) ? 2 : 1);
            addNumBlock(x, y, value);
        });
    }

    // Find the empty block on the board
    // Matrix element: 1: empty; 0: occupied
    function findSpace() {
        var board_blank = [];
        for (var y = 0; y < board.length; y++) {
            board_blank.push([]);
            for (var x = 0; x < board[y].length; x++) {
                if (board[y][x] != 0) {
                    board_blank[y].push(0);
                } else {
                    board_blank[y].push(1);
                }
            }
        }
        return board_blank;
    }

    // Finding the corresponding x,y index for a position in the random sequence
    // Return [x, y]
    function positionToXY(position, board_blank) {
        var count = 0;
        var coordinates = [];
        board_blank.forEach(function (row, indexY) {
            row.forEach(function (element, indexX) {
                if (element == 1) {
                    if (count == position) {
                        coordinates.push(indexX);
                        coordinates.push(indexY);
                    }
                    count++;
                }
            });
        });
        return coordinates;
    }

    function addNumBlock(x, y, value) {
        /* x, y are integers, indicating the index on x and y coordinates */
        board[y][x] = value;
        blockCreationCounter++;
        boardBlockId[y][x] = blockCreationCounter;

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
        $("#board").append(numBlock);
    }

    function registerButtons() {
        $("#move_up").click(function (event) {
            moveUp(event);
        });
        $("#move_left").click(function (event) {
            moveLeft(event);
        });
        $("#move_right").click(function (event) {
            moveRight(event);
        });
        $("#move_down").click(function (event) {
            moveDown(event);
        });
    }

    function registerKeyboards() {
        document.addEventListener("keydown", (event) => {
            var key = event.key || event.keyCode;
            switch(key){
                case "ArrowUp":
                case 38:
                case "W":
                case "w":
                    moveUp(event);
                    break;
                case "ArrowLeft":
                case 37:
                case "A":
                case "a":
                    moveLeft(event);
                    break;
                case "ArrowRight":
                case 39:
                case "D":
                case "d":
                    moveRight(event);
                    break;
                case "ArrowDown":
                case 40:
                case "S":
                case "s":
                    moveDown(event);
                    break;
            }
        });
    }

    function moveUp(event) {
        event.preventDefault();
        slide('N');
        setTimeout(generateRandomNumBlock, 500);
    }

    function moveLeft(event) {
        event.preventDefault();
        slide('W');
        setTimeout(generateRandomNumBlock, 500);
    }

    function moveRight(event) {
        event.preventDefault();
        slide('E');
        setTimeout(generateRandomNumBlock, 500);
    }

    function moveDown(event) {
        event.preventDefault();
        slide('S');
        setTimeout(generateRandomNumBlock, 500);
    }

    function slide(direction) {
        // check if the game is stuck
        if (gameStuck) {
            if (score > best) {
                updateBest(score);
            }
            showLose();
        }

        var seq = [0, 1, 2, 3];
        switch (direction) {
            case 'N':
                seq.forEach(element => move1d("y", element, "d"));
                break;
            case 'W':
                seq.forEach(element => move1d("x", element, "d"));
                break;
            case 'S':
                seq.forEach(element => move1d("y", element, "i"));
                break;
            case 'E':
                seq.forEach(element => move1d("x", element, "i"));
                break;
        }

        // check if the game ends
        // check if win
        if (gameWon) {
            if (score > best) {
                updateBest(score);
            }
            showWin();
        }
    }

    // Moving along an axis
    // axis: along x/y axis; index: which row/column;
    // direction: "i": increasing direction (e.g., y=0 -> y=3), "d": decreasing direction;
    function move1d(axis, index, direction) {
        move1dHandle(axis, index, direction, 3);
    }

    // step: from 3 to 0, indicating the remaining blocks to handle (from the farest one to the target wall);
    function move1dHandle(axis, index, direction, step) {
        if (step <= 0) {
            return;
        }

        var step_real = step;
        var delta = -1;
        if (direction == "i") {
            step_real = 3 - step;
            delta = 1;
        }

        var nextPos = 0;
        if (axis == "y") {
            move1dHandle(axis, index, direction, step - 1);
            if (board[step_real][index] == 0) {
                // Nothing there to be handled
            } else {
                nextPos = step_real + delta;
                if (nextPos >= 0 && nextPos < 4) {
                    if (board[nextPos][index] == 0) {
                        // the block of next position is empty
                        move(index, step_real, index, nextPos);
                        move1dHandle(axis, index, direction, step - 1);
                    } else if (board[step_real][index] == board[nextPos][index]) {
                        merge(index, nextPos, index, step_real);
                        // If any changes of blocks occur, re-compute from the farest end.
                        move1dHandle(axis, index, direction, step - 1);
                    }
                }
            }
        } else {
            move1dHandle(axis, index, direction, step - 1);
            if (board[index][step_real] == 0) {
                // Nothing there to be handled
            } else {
                nextPos = step_real + delta;
                if (nextPos >= 0 && nextPos < 4) {
                    if (board[index][nextPos] == 0) {
                        // the block of next position is empty
                        move(step_real, index, nextPos, index);
                        move1dHandle(axis, index, direction, step - 1);
                    } else if (board[index][step_real] == board[index][nextPos]) {
                        merge(nextPos, index, step_real, index);
                        // If any changes of blocks occur, re-compute from the farest end.
                        move1dHandle(axis, index, direction, step - 1);
                    }
                }
            }
        }
        return;
    }

    // Move the target block to target x & target y
    function move(x, y, tx, ty) {
        // checking
        if (board[ty][tx] != 0) {
            return;
        }

        // animation
        let blockId = boardBlockId[y][x];
        let moveX = (tx - x) * (numBlockWidth + boardPadding);
        let moveY = (ty - y) * (numBlockHeight + boardPadding);
        $("#num_block_" + blockId).css({
            "transform": "translate(" + moveX + "px, " + moveY + "px)"
        }).promise().done(function () {
            $("#num_block_" + blockId).css({
                "left": "" + (boardOriginX + tx * (numBlockWidth + boardPadding)) + "px",
                "top": "" + (boardOriginY + ty * (numBlockHeight + boardPadding)) + "px",
                "transform": "none"
            });
        });

        // update the board and boardBlockId matrix
        boardBlockId[ty][tx] = boardBlockId[y][x];
        boardBlockId[y][x] = 0;
        board[ty][tx] = board[y][x];
        board[y][x] = 0;
    }

    // Merging two blocks to the first block's location
    function merge(x1, y1, x2, y2) {
        // checking
        if (board[y1][x1] != board[y2][x2]) {
            return;
        }

        var block1Id = boardBlockId[y1][x1];
        var block2Id = boardBlockId[y2][x2];
        var value = board[y1][x1] + board[y2][x2];

        // animation
        let moveX = (x1 - x2) * (numBlockWidth + boardPadding);
        let moveY = (y1 - y2) * (numBlockHeight + boardPadding);
        $("#num_block_" + block2Id).css({
            "transform": "translate(" + moveX + "px, " + moveY + "px)"
        }).promise().done(function () {
            $("#num_block_" + block2Id).css({
                "left": "" + (boardOriginX + x1 * (numBlockWidth + boardPadding)) + "px",
                "top": "" + (boardOriginY + y1 * (numBlockHeight + boardPadding)) + "px",
                "transform": "none"
            }).promise().done(function () {
                // delete two blocks, reset the values for the location on board & boardBlockId
                $("#num_block_" + block1Id).remove();
                boardBlockId[y1][x1] = 0;
                board[y1][x1] = 0;

                $("#num_block_" + block2Id).remove();
                boardBlockId[y2][x2] = 0;
                board[y2][x2] = 0;

                // create the merged block
                addNumBlock(x1, y1, value);

                // add some points to the score
                addScore(value);

                // check if win
                gameWon = checkIfWin(value);
            });
        });
    }

    function addScore(points) {
        score += points;

        // refresh the displayed score
        $("#mark").html(score.toString());
    }

    function checkIfWin(value) {
        if (value >= 2048) {
            return true;
        } else {
            return false;
        }
    }

    function initializeBest() {
        // read the best score from the cookie
        var bestSaved = getCookie("best");
        if (bestSaved != "") {
            best = parseInt(bestSaved);
        }

        displayBest();
    }

    function updateBest(points) {
        best = points;
        displayBest();

        // write into the cookie
        setCookie("best", best, 30);
    }

    function displayBest() {
        // refresh the displayed best score
        $("#best").html(best.toString());
    }

    /* From w3schools.com, retrieved from: https://www.w3schools.com/js/js_cookies.asp */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /* From w3schools.com, retrieved from: https://www.w3schools.com/js/js_cookies.asp */
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function showWin() {
        $("div.wall").show();
        $("div.win").show();
    }

    function showLose() {
        $("div.wall").show();
        $("div.lose").show();
    }
})();