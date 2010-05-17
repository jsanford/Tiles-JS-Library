/*!
 * Tiles JavaScript Library v0.1.0
 *
 * Copyright 2010, Jonathan Sanford
 * Licenced under the MIT and GPL Version 2 licenses.
 *
 * Uses jquery-1.4.2.js
 * http://jquery.com/
 * Copyright 2010, John Resig
 * Released under the MIT, and GPL Licenses.
 *
 * Date: Wed May 12, 2010
 */

var tiles = {};
var solution = {};
var emptyX, emptyY = 0;
var animating = false;
var successHandler = function() {};

function checkTilesSolution() {
    if (solution[emptyX + "_" + emptyY] != null)
        return;
    var x = 0;
    for (var loc in solution) {
        if (tiles[loc] != solution[loc])
           return;
    }
    successHandler();
}

function moveTile(fx, fy, tx, ty, width, height) {
    if (animating || (fx == emptyX && fy == emptyY))
        return;
    var fromName = fx + "_" + fy;
    var toName = tx + "_" + ty;
    var from = tiles[fromName];
    var to = tiles[toName];
    if (!from || to)
        return;
    animating = true;
    $(from).animate(
        {"left": (tx * width) + "px", 
        "top": (ty * height) + "px"},
        500,
        function() {
            tiles[toName] = tiles[fromName];
            tiles[fromName] = undefined;
            emptyX = fx;
            emptyY = fy;
            animating = false;
            checkTilesSolution();
        }
    );
}

function addTileNav(fx, fy, tx, ty, width, height, navSize) {
    var navName = fx + "_" + fy + "-" + tx + "_" + ty;
    $('#canvas').append('<div id="' + navName + '" class="nav"></div>');
    var nav = $("#" + navName);
    var left = "";
    var top = "";
    var navWidth = navSize;
    var navHeight = navSize;
    if (fx == tx) {
        navHeight = navSize / 2;
        left = (fx * width) + (width / 2) - (navWidth / 2);
        if (fy > ty)
            top = (fy * height) - navHeight;
        else
            top = ty * height;
    } else {
        navWidth = navSize / 2;
        top = (fy * height) + (height / 2) - (navHeight / 2);
        if (fx > tx)
            left = (fx * width) - navWidth;
        else
            left = tx * width;
    } 
    nav.css("left", left); 
    nav.css("top", top);
    nav.css("width", navWidth);
    nav.css("height", navHeight);
    nav.click(function(obj) {moveTile(fx, fy, tx, ty, width, height);});
}

function addTile(dx, dy, width, height, borderWidth, content, image, offx, offy) {
    var tileName = dx + "_" + dy;
    $('#canvas').append('<div id="' + tileName + '" class="tile">' + content + '</div>');
    var tile = $("#" + tileName);
    if (image != null)
        tile.css("background", "transparent url(" + image + ") no-repeat scroll -" + (offx * width) + "px -" + (offy * height) + "px");
    tile.css("left", dx * width);
    tile.css("top", dy * height);
    if (navigator.appName == 'Microsoft Internet Explorer') {
        tile.css("width", width);
        tile.css("height", height);
    } else {
        tile.css("width", width - (2 * borderWidth));
        tile.css("height", height - (2 * borderWidth));
    }
    tile.css("border-width", borderWidth);
    tiles[tileName] = tile;
    solution[offx + "_" + offy] = tile;
}

function initTilesKeyHandler(dx, dy, width, height) {
    emptyX = 0;
    emptyY = 0;
    $(document).keydown(function(event) {
        if (event.keyCode == '37' && emptyX < dx - 1)
            moveTile(emptyX + 1, emptyY, emptyX, emptyY, width, height);
        if (event.keyCode == '38' && emptyY < dy - 1)
            moveTile(emptyX, emptyY + 1, emptyX, emptyY, width, height);
        if (event.keyCode == '39' && emptyX > 0)
            moveTile(emptyX - 1, emptyY, emptyX, emptyY, width, height);
        if (event.keyCode == '40' && emptyY > 0)
            moveTile(emptyX, emptyY - 1, emptyX, emptyY, width, height);
    });
}

function initTilesCSS(tileWidth, tileHeight, dx, dy, navSize) {
    $('#canvas').css("width", tileWidth * dx);
    $('#canvas').css("height", tileHeight * dy);
    $('.content').css("width", tileWidth - navSize - 6);
    $('.content').css("height", tileHeight - navSize - 6);
    $('.content').css("padding", (navSize / 2) + 3);
}

function initTilesSolution(dx, dy) {
    var remaining = [];
    for(var i=0; i < dx; i++) {
        for(var j=0; j < dy; j++) {
            if (i > 0 || j > 0) {
                var point = new Object();
                point.x = i;
                point.y = j;
                remaining.push(point);
            }
        }
    }
    return remaining;
}

function initTilesCanvas(tileWidth, tileHeight, dx, dy, borderWidth, navSize, message, image, remaining) {
    var index = 0;
    for(var j=0; j < dy; j++) {
        for(var i=0; i < dx; i++) {
            if (i > 0 || j > 0) { 
                var tileMessage = "";
                if (message != null && index < message.length)
                    tileMessage = message[index++];
                var rIndex = Math.floor(Math.random() * remaining.length);
                var point = remaining[rIndex];
                addTile(i, j, tileWidth, tileHeight, borderWidth, "<h1>" + tileMessage + "</h1>", image, point.x, point.y);
                if (rIndex < remaining.length - 1)
                    remaining[rIndex] = remaining.pop();
                else
                    remaining.pop();
            }
            if (i > 0)
                addTileNav(i, j, i - 1, j, tileWidth, tileHeight, navSize);
            if (j > 0)
                addTileNav(i, j, i, j - 1, tileWidth, tileHeight, navSize);
            if (i < dx - 1)
                addTileNav(i, j, i + 1, j, tileWidth, tileHeight, navSize);
            if (j < dy - 1)
                addTileNav(i, j, i, j + 1, tileWidth, tileHeight, navSize);
        }
    }

}

function initTiles(tileWidth, tileHeight, dx, dy, borderWidth, navSize, message, image, handler) {
    // Initialize successHandler
    if (handler != null)
        successHandler = handler;

    // Initialize css
    initTilesCSS(tileWidth, tileHeight, dx, dy, navSize);

    // Initialize solution
    var remaining = initTilesSolution(dx, dy);


    // Initialize canvas
    initTilesCanvas(tileWidth, tileHeight, dx, dy, borderWidth, navSize, message, image, remaining);

    // initialize key handler
    initTilesKeyHandler(dx, dy, tileWidth, tileHeight);
}
