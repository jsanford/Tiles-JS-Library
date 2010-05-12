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
var animating = false;

function moveTile(fx, fy, tx, ty, width, height) {
    if (animating) {
        alert("Life won't pass you by that fast. Slow down and b r e a t h.");
        return;
    }
    var fromName = fx + "" + fy;
    var toName = tx + "" + ty;
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
            animating = false;
        }
    );
}

function addNav(fx, fy, tx, ty, width, height, navSize) {
    var navName = fx + "" + fy + "-" + tx + "" + ty;
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

function addTile(dx, dy, width, height, content) {
    var tileName = dx + "" + dy;
    $('#canvas').append('<div id="' + tileName + '" class="tile">' + content + '</div>');
    var tile = $("#" + tileName);
    tile.css("left", dx * width);
    tile.css("top", dy * height);
    tile.css("width", width - 4);
    tile.css("height", height - 4)
    tiles[tileName] = tile;
}
    
function initTiles(canvasWidth, canvasHeight, tileWidth, tileHeight, navSize, message) {
    $('#canvas').css("width", canvasWidth);
    $('#canvas').css("height", canvasHeight);
    $('.content').css("width", tileWidth - navSize - 6);
    $('.content').css("height", tileHeight - navSize - 6);
    $('.content').css("padding", (navSize / 2) + 3);

    var dx = canvasWidth / tileWidth;
    var dy = canvasHeight / tileHeight;
    var index = 0;
    for(var j=0; j < dy; j++) {
        for(var i=0; i < dx; i++) {
            if (i > 0 || j > 0) { 
                var tileMessage = "";
                if (index < message.length)
                    tileMessage = message[index];
                index += 1;
                addTile(i, j, tileWidth, tileHeight, "<h1>" + tileMessage + "</h1>");
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
}


