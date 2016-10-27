;(function($, document, window, undefined) {
  'use strict';

  $.drawing = {};

  var sprite = undefined;
  var tiles = undefined;
  var context = undefined;

  (function initialize() {
    tiles = _buildTiles();
    _loadSprite();

    var node = $('.game-main-container').get(0);
    $.drawing.dimension = _calculateWindowDimensions(node);

    var canvasHtml = [
      '<canvas class="game-board" width="',
      $.drawing.dimension.width,
      '" height="',
      $.drawing.dimension.height,
      '"></canvas>'
    ].join('');
    node.find('.game-container').get(0).setInnerHtml(canvasHtml);

    $.drawing.canvas = node.find('.game-board').get(0);
    context = $.drawing.canvas.node.getContext('2d');
    $.drawing.context = context;
    $.drawing.draw = _draw;
  })();

  // Functions
  function _loadSprite() {
    var img = new Image();
    img.onload = function() {
      sprite = img;
      _spriteLoaded();
    };
    img.src = 'images/sprite.png';
  }

  function _spriteLoaded() {
    // for (var index = 0; index < 9; index++)
    //   _drawTile(tiles[index], 0, index * 31);
    // DRAW GAME
  }

  function _draw(game, activeTile) {
    _clear();

    var tileHeight = 31;

    for (var column = 0; column < game.length; column++) {
      var x = column * 330;
      var y = $.drawing.dimension.height - tileHeight;

      for (var tile = game[column].length - 1; tile >= 0; tile--) {
        // console.log("Drawing tile " + (tile + 1) + " at (" + x + ", " + y + ").");
        _drawTile(tiles[tile], x, y);
        y -= tileHeight;
      }
    }
  }

  function _clear() {
    context.clearRect(0, 0, $.drawing.dimension.width, $.drawing.dimension.height);
  }

  function _buildTiles() {
    var tiles = {};

    [
      'first', 'second', 'third',
      'fourth', 'fifth', 'sixth',
      'seventh', 'eighth', 'nineth'
    ].each(function(index) {
      tiles[this] = {
        draw: function(position) {
          console.log("Drawing tile " + (index + 1) + " at (" + position.x + ", " + position.y + ").");
          // context.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh);
          context.drawImage(sprite, 0, (index * 40 + 10), 330, 33, position.x, position.y, 330, 33);
        }
      };

      tiles[index] = tiles[this];
    });

    return tiles;
  }

  function _calculateWindowDimensions(gameNode) {
    var style = window.getComputedStyle(gameNode.node, null);

    var width = toNumber(style.getPropertyValue('width'));
    ['right', 'left'].each(function() {
      width -= toNumber(style.getPropertyValue('padding-' + this));
    });

    return { width: width, height: 300 };

    function toNumber(text) {
      return parseInt(text.replace(/([^\d|\.|\-|\+]+)/g, ''), 10);
    }
  }

  function _drawTile(tile, x, y) {
    tile.draw({
      x: x,
      y: y
    });
  }

  // ctx.translate(100, 50); // change relative origin (0, 0)


  // var ctx = $('.game-board').get(0).node.getContext('2d');

  // ctx.fillRect(40, 40, 20, 30);
  //
  //
  // setTimeout(function() {
  //   ctx.moveTo(50, 50);
  // }, 1000);

  //
  // ctx.save(); // Save the actual position before translating
  //
  // ctx.beginPath();
  //
  // ctx.translate(100, 50); // change relative origin (0, 0)
  //
  // ctx.moveTo(0, 0);
  // ctx.lineTo(100, 0);
  // ctx.lineTo(100, 80);
  // ctx.lineTo(0, 100);
  // ctx.lineTo(0, 0);
  //
  // ctx.fillStyle = "blue";
  // ctx.fill();
  //
  // ctx.stroke();
  //
  //
  // ctx.restore(); // translate back to the last save
  //
  // ctx.beginPath();
  // ctx.arc(101, 100, 100, Math.PI / 2, Math.PI);
  // ctx.strokeStyle = "red";
  // ctx.fillStyle = 'green';
  // ctx.stroke();
  // ctx.fill();
  //
  // ctx.beginPath();
  // ctx.moveTo(20, 10);
  // ctx.lineTo(80, 10);
  // ctx.quadraticCurveTo(90, 10, 90, 20);
  // ctx.lineTo(90, 80);
  // ctx.quadraticCurveTo(90, 90, 80, 90);
  // ctx.lineTo(20, 90);
  // ctx.quadraticCurveTo(10, 90, 10, 80);
  // ctx.lineTo(10, 20);
  // ctx.quadraticCurveTo(10, 10, 20, 10);
  // ctx.stroke();


  // var x = 100, y = 200;
  //
  // for (var index = 0; index < 4; index++) {
  // }
  //
})($, document, window);