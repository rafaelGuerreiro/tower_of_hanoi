;(function($, document, window, undefined) {
  'use strict';

  var MAX_TILES = 9;

  var game = [[], [], []];
  var activeTile = null;

  var queue = [];
  var animating = false;

  $.game = {
    initialize: _initialize,
    selectTile: _selectTile
  };

  // TODO disable the select box after the amount is entered
  // TODO button to start and stop the game (space bar shortcut)
  // TODO score
  // TODO timer
  // TODO visual elements displaying the action that was made by the user
  // TODO add labels below the game to let users know what to do
  // TODO add more than one player for multiplayer support
  // TODO 3 methods of computer: easy, medium and hard

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

    $('.tiles-amount').setInnerHtml(options.join(''));
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

    $('.tile').each(function() {
      var tileIndex = this.data('tile');
      if (tileIndex >= amount)
        return;

      this.removeClass('hide');

      var column = this.parent();
      var columnIndex = column.data('column');

      game[columnIndex].splice(tileIndex, 0, {
        nodes: {
          tile: this,
          column: column
        },
        tile: tileIndex,
        column: columnIndex
      });
    });
  }

  function _reset() {
    game = [[], [], []];
    activeTile = null;

    $('.game-container').get(0).setInnerHtml(_buildGameSetup());
  }

  function _buildGameSetup() {
    var gameSetup = [];
    for (var column = 0; column < 3; column++) {
      gameSetup.push('<div class="column-container"><div class="column" data-column="')
      gameSetup.push(column);
      gameSetup.push('">');

      if (column === 0)
        for (var tile = 0; tile < MAX_TILES; tile++) {
          gameSetup.push('<div class="tile tile-');
          gameSetup.push(tile + 1);
          gameSetup.push(' hide" data-tile="');
          gameSetup.push(tile);
          gameSetup.push('"></div>');
        }

      gameSetup.push('</div><div class="tile-base"></div>');
      gameSetup.push('<div class="shortcut"><span class="label label-success">');
      gameSetup.push(column + 1);
      gameSetup.push('</span></div></div>');
    }

    return gameSetup.join('');
  }

  function _selectTile(index) {
    if (typeof index !== 'number' || index > 2 || index < 0)
      return;

    _queue(index);
  }

  function _queue(index) {
    if (animating)
      queue.push(index);
    else
      _invokeAction(index);
  }

  function _invokeAction(index) {
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

    // _animate($.drawing.selectTile, tile.tile, function() {
    //   activeTile = tile;
    // });
  }

  function _unselectTile() {
    activeTile.nodes.tile.removeClass('active');
    activeTile = null;
    // _animate($.drawing.unselectTile, activeTile.tile, function() {
    //   activeTile = null;
    // });
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

    // _animate($.drawing.moveTileTo, index, activeTile.tile, function() {
    //   game[activeTile.column].remove(activeTile);
    //   game[index].splice(0, 0, activeTile);
    //
    //   activeTile.column = index;
    //   _unselectTile();
    // });
  }

  function _animate(fn) {
    if (typeof fn !== 'function')
      return;

    var args = Array.prototype.slice.call(arguments, 1);

    var callback = args[args.length - 1];
    if (typeof callback === 'function')
      args[args.length - 1] = _animationCallback(callback);
    else
      args.push(_animationCallback());

    animating = true;
    fn.apply(undefined, args);

    function _animationCallback(otherCallback) {
      return function() {
        if (typeof callback === 'function')
          otherCallback();

        animating = false;
        _invokeNext();
      };
    }
  }

  function _invokeNext() {
    if (queue.length === 0)
      return;

    _invokeAction(queue.shift());
  }

  function _isAbleToMove(index) {
    var column = game[index];

    if (column.length === 0)
      return true;

    return activeTile.tile < column[0].tile;
  }
})($, document, window);