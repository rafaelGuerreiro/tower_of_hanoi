;(function($, document, window, undefined) {
  'use strict';

  var timeouts = {};

  $.computer = {
    quit: _quit,
    register: _register
  };

  // functions
  function _quit() {
    Object.keys(timeouts).each(function() {
      clearTimeout(timeouts[this]);
    });

    timeouts = {};
  }

  function _register(definition) {
    definition.computer = {
      direction: definition.player.tiles % 2 === 0 ? 1 : -1,
      moveFirstTile: true,
      difficulty: definition.player.type,
      interval: _calculateInterval(definition.player.type)
    };

    $.game.listen('play', _play(definition));
    $.game.listen('pause', _pause(definition));
  }

  function _play(definition) {
    return function() {
      _pause(definition)();
      _start(definition);
    };
  }

  function _start(definition) {
    timeouts[definition.player.id] = setTimeout(function() {
      _selectTile(definition)
    }, definition.computer.interval);
  }

  function _selectTile(definition) {
    var columns = [];
    if (definition.computer.moveFirstTile)
      _moveFirstTile(definition, columns);
    else
      _onlyAvailableMovement(definition, columns);

    $.game.atomicMoveTile(definition, columns[0], columns[1], function() {
      definition.computer.moveFirstTile = !definition.computer.moveFirstTile;
      _start(definition);
    });
  }

  function _moveFirstTile(definition, columns) {
    var index = _findColumnOfFirstTile(definition.board);

    if (index < 0)
      return;

    columns[0] = index;

    var target = (index + definition.computer.direction) % 3;
    if (target < 0)
      target = 3 + target;

    columns[1] = target;
  }

  function _findColumnOfFirstTile(board) {
    for (var column = 0; column < board.length; column++)
      if (board[column].length > 0 && board[column][0].tile === 0)
        return column;

    return -1;
  }

  function _onlyAvailableMovement(definition, columns) {
    var indexes = _findColumnsThatAreNotTheFirst(definition.board);

    columns[0] = indexes[0];
    columns[1] = indexes[1];
  }

  function _findColumnsThatAreNotTheFirst(board) {
    var tiles = [];

    var index = 0;
    for (var columnIndex = 0; columnIndex < board.length; columnIndex++) {
      var column = board[columnIndex];

      if (column.length === 0 || column[0].tile !== 0) {
        tiles[index++] = {
          index: columnIndex,
          tile: column.length === 0 ? Number.MAX_VALUE : column[0].tile
        };
      }
    }

    if (tiles[0].tile > tiles[1].tile) {
      var temp = tiles[0];
      tiles[0] = tiles[1];
      tiles[1] = temp;
    }

    return [tiles[0].index, tiles[1].index];
  }

  function _pause(definition) {
    return function() {
      var id = timeouts[definition.player.id];

      if (id !== undefined)
        clearTimeout(id);
    };
  }

  function _calculateInterval(difficulty) {
    var base = 125;

    if ('easy' === difficulty)
      return (base * 10);

    if ('medium' === difficulty)
      return (base * 6);

    if ('hard' === difficulty)
      return (base * 4);

    return base;
  }
})($, document, window);