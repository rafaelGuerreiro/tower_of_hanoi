;(function($, document, window, undefined) {
  'use strict';

  $.drawing = {
    draw: _draw,
    clear: _clear,
    selectTile: _selectTile,
    unselectTile: _unselectTile,
    moveTileTo: _moveTileTo
  };

  var sprite = undefined;
  var tiles = undefined;
  var context = undefined;

  var isDrawn = false;

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
    //   tiles[index].draw({ x: 0, y: index * 31 });
    // DRAW GAME
  }

  function _draw(game, callback) {
    if (isDrawn)
      _clear();

    var callbackInvoked = false;

    var tileHeight = 33;
    for (var column = 0; column < game.length; column++) {
      var x = column * 330;
      var y = $.drawing.dimension.height - tileHeight;

      for (var tile = game[column].length - 1; tile >= 0; tile--) {
        // console.log("Drawing tile " + (tile + 1) + " at (" + x + ", " + y + ").");
        tiles[tile].draw({ x: x, y: y });
        y -= tileHeight;
      }
    }

    isDrawn = true;

    if (!callbackInvoked && typeof callback === 'function')
      callback();
  }

  function _selectTile(index, callback) {
    var tile = tiles[index];
    _animate('y', tile, tile.position, { x: tile.position.x, y: 5 }, callback);
  }

  function _unselectTile(index, callback) {
    var tile = tiles[index];
    _animate('y', tile, tile.position, { x: tile.position.x, y: 200 }, callback);
  }

  function _moveTileTo(column, index, callback) {
    var tile = tiles[index];
    var columnPosition = column * 330;
    _animate('x', tile, tile.position, { x: columnPosition , y: tile.position.y }, callback);
  }

  function _animate(type, tile, origin, target, callback) {
    var wait = 10;
    var rounds = 1000 / wait;

    var step = {
      x: 2 * (origin.x - target.x) / rounds, // multiply by 2 so it will take longer steps
      y: 2 * (origin.y - target.y) / rounds, // multiply by 2 so it will take longer steps
    };

    if (type === 'x')
      _animateX(tile, wait, origin.y, origin.x, target.x, step.x);
    else if (type === 'y')
      _animateY(tile, wait, origin.x, origin.y, target.y, step.y);
  }

  function _animateY(tile, wait, x, origin, target, step) {
    var position = { x: x, y: origin };
    var interval = setInterval(function() {
      _clear(position);
      if (!_isOffset(position.y, target))
        position.y -= step;

      tile.draw(position);

      if (_isOffset(position.y, target)) {
        clearInterval(interval);
        if (typeof callback === 'function')
          callback();
      }
    }, wait);
  }

  function _animateX(tile, wait, y, origin, target, step) {
    var position = { x: origin, y: y };
    var interval = setInterval(function() {
      _clear(position);
      if (!_isOffset(position.x, target))
        position.x -= step;

      tile.draw(position);

      if (_isOffset(position.x, target)) {
        clearInterval(interval);
        if (typeof callback === 'function')
          callback();
      }
    }, wait);
  }

  function _isOffset(position, target) {
    return position <= target;
  }

  function _clear(position) {
    if (typeof position !== 'object') {
      context.clearRect(0, 0, $.drawing.dimension.width, $.drawing.dimension.height);
      isDrawn = false;

      return;
    }

    context.clearRect(position.x, position.y, 330, 33);
  }

  function _buildTiles() {
    var tiles = {};

    [ 1, 2, 3,
      4, 5, 6,
      7, 8, 9
    ].each(function(index) {
        var tile = {
          position: {},
          draw: function(position) {
            // console.log("Drawing tile " + (index + 1) + " at (" + position.x + ", " + position.y + ").");
            // context.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh);
            context.drawImage(sprite, 0, (index * 40 + 10), 330, 33, position.x, position.y, 330, 33);
            this.position.x = position.x;
            this.position.y = position.y;
          }
        };

        tiles[index] = tile;
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