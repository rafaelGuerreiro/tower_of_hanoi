;(function($, document, window, undefined) {
  'use strict';

  $.drawing = {};

  var sprite = undefined;
  var tiles = undefined;
  var context = undefined;

  (function initialize() {
    sprite = _loadSprite();
    tiles = _buildTiles();

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
    $.drawing.context = $.drawing.canvas.node.getContext('2d');
    context = $.drawing.context;

    _drawTile(tiles.nineth);
  })();

  // Functions
  function _loadSprite() {}

  function _buildTiles() {
    return [
      'first', 'second', 'third',
      'fourth', 'fifth', 'sixth',
      'seventh', 'eighth', 'nineth'
    ].map(function() {
      return this;
    });
  }

  function _calculateWindowDimensions(gameNode) {
    var style = window.getComputedStyle(gameNode.node, null);

    var width = toNumber(style.getPropertyValue('width'));
    ['right', 'left'].each(function() {
      width -= toNumber(style.getPropertyValue('padding-' + this));
    });

    return { width: width, height: 300 }

    function toNumber(text) {
      return parseInt(text.replace(/([^\d|\.|\-|\+]+)/g, ''), 10);
    }
  }

  function _drawTile(size) {



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