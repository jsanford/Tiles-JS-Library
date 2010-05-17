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
        }
    );
}

function addNav(fx, fy, tx, ty, width, height, navSize) {
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

function addTile(dx, dy, width, height, content, image, offx, offy) {
    var tileName = dx + "_" + dy;
    $('#canvas').append('<div id="' + tileName + '" class="tile">' + content + '</div>');
    var tile = $("#" + tileName);
    if (image != null)
        tile.css("background", "transparent url(" + image + ") no-repeat scroll -" + (offx * width) + "px -" + (offy * height) + "px");
    tile.css("left", dx * width);
    tile.css("top", dy * height);
    tile.css("width", width - 4);
    tile.css("height", height - 4)
    tiles[tileName] = tile;
    solution[offx + "_" + offy] = tile;
}

function initTileKeyHandler(dx, dy, width, height) {
    emptyX = 0;
    emptyY = 0;
    $(document).keypress(function(event) {
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

function initTiles(tileWidth, tileHeight, dx, dy, navSize, message, image, handler) {
    if (handler != null)
        successHandler = handler;

    $('#canvas').css("width", tileWidth * dx);
    $('#canvas').css("height", tileHeight * dy);
    $('.content').css("width", tileWidth - navSize - 6);
    $('.content').css("height", tileHeight - navSize - 6);
    $('.content').css("padding", (navSize / 2) + 3);

    var remaining = [];
    for(var i=0; i < dx; i++) {
        for(var j=0; j < dy; j++) {
            var point = new Object();
            point.x = i;
            point.y = j;
            remaining.push(point);
        }
    }

    var index = 0;
    for(var j=0; j < dy; j++) {
        for(var i=0; i < dx; i++) {
            if (i > 0 || j > 0) { 
                var tileMessage = "";
                if (message != null && index < message.length)
                    tileMessage = message[index++];
                var rIndex = Math.floor(Math.random() * remaining.length);
                var point = remaining[rIndex];
                addTile(i, j, tileWidth, tileHeight, "<h1>" + tileMessage + "</h1>", image, point.x, point.y);
                if (rIndex < remaining.length - 1)
                    remaining[rIndex] = remaining.pop();
                else
                    remaining.pop();
            }
            if (i > 0)
                addNav(i, j, i - 1, j, tileWidth, tileHeight, navSize);
            if (j > 0)
                addNav(i, j, i, j - 1, tileWidth, tileHeight, navSize);
            if (i < dx - 1)
                addNav(i, j, i + 1, j, tileWidth, tileHeight, navSize);
            if (j < dy - 1)
                addNav(i, j, i, j + 1, tileWidth, tileHeight, navSize);
        }
    }

    initTileKeyHandler(dx, dy, tileWidth, tileHeight);
}


