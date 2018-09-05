function makeTile(glyph) {
  return overprint.Glyph(glyph, Math.random() > 0.5 ? "#acc8a4" : "#80ae74", Math.random() > 0.5 ? "#529546" : "#0f7c11");
}

var Tiles = {
  LowerLeft: makeTile("◣"),
  UpperLeft: makeTile("◤"),
  UpperRight: makeTile("◥"),
  LowerRight: makeTile("◢")
}

function shuffleTiles(tiles) {
  var result = tiles.slice(0);
  for (var i = tiles.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function generateRegularPattern() {
  var pattern = shuffleTiles(Object.keys(Tiles));

  return function(x, y) {
    if (x % 2 == 0) {
      return (y % 2 == 0) ? Tiles[pattern[0]] : Tiles[pattern[1]];
    } else {
      return (y % 2 == 0) ? Tiles[pattern[2]] : Tiles[pattern[3]];
    }
  }
}

function generateRandomPattern() {
  var pattern = shuffleTiles(Object.keys(Tiles));

  return function(x, y) {
    var index = Math.floor(Math.random() * pattern.length);
    return Tiles[pattern[index]];
  }
}

function chooseNestedGenerator() {
  return (Math.random() > 0.4) ? generateRegularPattern() : generateRandomPattern();
}

function generatePattern() {
  var patternA = chooseNestedGenerator();
  var patternB = chooseNestedGenerator();
  var patternC = chooseNestedGenerator();
  var patternD = chooseNestedGenerator();

  return function (x, y) {
    if (x % 2 == 0) {
      return (y % 2 == 0) ? patternA(x, y) : patternB(x, y);
    } else {
      return (y % 2 == 0) ? patternC(x, y) : patternD(x, y);
    }
  }
}

var tilePattern = generatePattern();

function getTile(x, y) {
  return tilePattern(x, y)
}

function renderTiling() {
  var canvas = document.getElementById("truchet-tiles");
  var canvasWidth = document.documentElement.clientWidth;
  var canvasHeight = document.documentElement.clientHeight / 2;
  canvasWidth = canvasWidth >= 820 ? canvasWidth : 820;

  canvas.style.width = canvasWidth.toString() + "px";
  canvas.style.height = canvasHeight.toString() + "px";

  var cols = 40;
  var rows = 20;
  var ratio = Math.ceil(canvasWidth / cols);
  var font = overprint.Font(false, false, ratio);
  var grid = new overprint.Terminal(cols, rows, canvas, font, false, true);

  for (var y=0; y<=rows; y++) {
    for (var x=0; x<cols; x++) {
      grid.writeGlyph(x, y, getTile(x, y));
    }
  }

  grid.render();

  var header = document.querySelector(".spread-cover header");
  header.style.left = ratio.toString() + "px";
  header.style.top = (ratio - 2).toString() + "px";
}

window.addEventListener('DOMContentLoaded', renderTiling);
window.addEventListener('resize', renderTiling);
