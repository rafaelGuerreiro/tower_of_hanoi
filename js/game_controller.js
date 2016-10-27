;(function($, document, window, undefined) {
  'use strict';

  var MAX_TILES = 9;

  var game = [[], [], []];
  var activeTile = null;

  $.game = {
    initialize: _initialize,
    selectTile: _selectTile
  };

  $('.tiles-amount').on('change', _initializeGame);

  (function init() {
    var options = ['<option value="0">Select the size</option>'];
    for (var amount = 3; amount <= MAX_TILES; amount++) {
      options.push('<option value="');
      options.push(amount);
      options.push('">');
      options.push(amount);
      options.push(' tiles</option>');
    }

    $('.tiles-amount').get(0).setInnerHtml(options.join(''));
  })();

  // functions
  function _initializeGame() {
    _initialize(this.val());
  }

  function _initialize(amount) {
    amount = Number(amount);
    if (isNaN(amount) || amount > 9 || amount < 3)
      return;

    _reset();

    for (var tile = 0; tile < amount; tile++)
      game[0].splice(tile, 0, {
        tile: tile,
        column: 0
      });

    _draw();
  }

  function _reset() {
    game = [[], [], []];
    activeTile = null;
  }

  function _draw() {
    $.drawing.draw(game, activeTile);
  }

  function _selectTile(index) {
    if (typeof index !== 'number' || index > 2 || index < 0)
      return;

    var column = $('.game-container .column').get(index);

    if (!activeTile)
      _activateTile(column, index);
    else if (activeTile.column === index)
      _unselectTile();
    else
      _moveTileTo(column, index);
  }

  function _activateTile(column, index) {
    var tile = column.find('.tile').get(0);
    if (tile) {
      tile.addClass('active');
      activeTile = game[index][0];
    }
  }

  function _unselectTile() {
    activeTile.nodes.tile.removeClass('active');
    activeTile = null;
  }

  function _moveTileTo(column, index) {
    if (!_isAbleToMove(index))
      return;

    game[activeTile.column].remove(activeTile);
    game[index].splice(0, 0, activeTile);

    activeTile.column = index;
    activeTile.nodes.column = column;

    column.prepend(activeTile.nodes.tile);

    _unselectTile();
  }

  function _isAbleToMove(index) {
    var column = game[index];

    if (column.length === 0)
      return true;

    return activeTile.tile < column[0].tile;
  }
})($, document, window);