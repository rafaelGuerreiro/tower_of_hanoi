;(function($, document, window, undefined) {
  'use strict';

  var MAX_TILES = 9;

  var game = {};

  var queue = {};

  $.game = {
    addPlayer: _addPlayer,
    selectTile: _selectTile
  };

  var $container = $('.game-container');

  // TODO button to start and stop the game (space bar shortcut)
  // TODO score
  // TODO timer
  // TODO add labels below the game to let users know what to do
  // TODO add more than one player for multiplayer support
  // TODO 3 methods of computer: easy, medium and hard

  (function init() {
  })();

  // functions
  function _addPlayer(player) {
    // {id: 0, name: "sf", shortcuts: Array[3], tiles: "3", type: "human" }
    // {id: 1, name: "sdf", tiles: "3", type: "easy", shortcuts: false}

    _initialize(player);
  }

  function _initialize(player) {
    player.tiles = Number(player.tiles);
    if (isNaN(player.tiles) || player.tiles > 9 || player.tiles < 3)
      return;

    _reset(player);

    var root = game[player.id].root;
    var board = game[player.id].board;

    // use id
    root.find('.tile').each(function(index) {
      var column = this.parent();
      var columnIndex = column.data('column');

      board[columnIndex].splice(index, 0, {
        nodes: {
          tile: this,
          column: column
        },
        tile: index,
        column: columnIndex
      });
    });
  }

  function _reset(player) {
    $container.append(_buildGameSetup(player));

    game[player.id] = {
      player: player,
      board: [[], [], []],
      activeTile: null,
      root: $('.game-container').find('.game-board[data-id="' + player.id + '"]').get(0)
    };

    if (player.type === 'human')
      $.user.register(game[player.id]);

    queue[player.id] = [];
    queue[player.id].animating = false;
  }

  function _buildGameSetup(player) {
    var gameSetup = [
      '<h3>',
      player.name,
      '</h3>',
      '<div class="game-board" data-id="',
      player.id,
      '">'
    ];

    for (var column = 0; column < 3; column++) {
      gameSetup.push('<div class="column-container"><div class="column" data-column="')
      gameSetup.push(column);
      gameSetup.push('">');

      if (column === 0)
        for (var tile = 0; tile < player.tiles; tile++) {
          gameSetup.push('<div class="tile tile-');
          gameSetup.push(tile + 1);
          gameSetup.push('" data-tile="');
          gameSetup.push(tile);
          gameSetup.push('"></div>');
        }

      gameSetup.push('</div><div class="tile-base"></div>');

      if (player.shortcuts) {
        gameSetup.push('<div class="shortcut"><span class="label label-success">');
        gameSetup.push(player.shortcuts[column]);
        gameSetup.push('</span></div>');
      }

      gameSetup.push('</div>');
    }

    gameSetup.push('</div>');
    return gameSetup.join('');
  }

  function _selectTile(id, index) {
    if (typeof index !== 'number' || index > 2 || index < 0)
      return;

    _queue(id, index);
  }

  function _queue(id, index) {
    if (queue[id].animating)
      queue[id].push(index);
    else
      _invokeAction(id, index);
  }

  function _invokeAction(id, index) {
    var player = game[id];
    var column = player.root.find('.column').get(index);

    if (!player.activeTile)
      _activateTile(player, column, index);
    else if (player.activeTile.column === index)
      _unselectTile(player);
    else
      _moveTileTo(player, column, index);
  }

  function _activateTile(player, column, index) {
    var tile = column.find('.tile').get(0);
    if (tile) {
      tile.addClass('active');
      player.activeTile = game[index][0];
    }

    // _animate($.drawing.selectTile, tile.tile, function() {
    //   activeTile = tile;
    // });
  }

  function _unselectTile(player) {
    player.activeTile.nodes.tile.removeClass('active');
    player.activeTile = null;
    // _animate($.drawing.unselectTile, activeTile.tile, function() {
    //   activeTile = null;
    // });
  }

  function _moveTileTo(player, column, index) {
    if (!_isAbleToMove(player, index))
      return;

    player.board[activeTile.column].remove(activeTile);
    player.board[index].splice(0, 0, activeTile);

    player.activeTile.column = index;
    player.activeTile.nodes.column = column;

    column.prepend(activeTile.nodes.tile);
    _unselectTile(player);

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

  function _isAbleToMove(player, index) {
    var column = player.board[index];

    if (column.length === 0)
      return true;

    return player.activeTile.tile < column[0].tile;
  }
})($, document, window);