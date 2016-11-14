;(function($, document, window, undefined) {
  'use strict';

  var MAX_TILES = 9;

  var playerDefinitions = {};

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

    var definition = playerDefinitions[player.id];
    var root = definition.root;
    var board = definition.board;

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

    var definition = {
      player: player,
      board: [[], [], []],
      activeTile: null,
      queue: [],
      animating: false,
      root: $('.game-container').find('.game-board[data-id="' + player.id + '"]').get(0)
    };

    if (player.type === 'human')
      $.user.register(definition);

    playerDefinitions[player.id] = definition;
  }

  function _buildGameSetup(player) {
    var gameSetup = [
      '<div class="game-board-container"><h3>',
      _htmlSafe(player.name),
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
        gameSetup.push(_htmlSafe(player.shortcuts[column]));
        gameSetup.push('</span></div>');
      }

      gameSetup.push('</div>');
    }

    gameSetup.push('</div></div>');
    return gameSetup.join('');
  }

  function _htmlSafe(text) {
    var container = document.createElement('div');
    container.innerText = text;
    return container.innerHTML;
  }

  function _selectTile(definition, index) {
    if (typeof index !== 'number' || index > 2 || index < 0)
      return;

    _queue(definition, index);
  }

  function _queueFirst(definition, index) {
    if (definition.animating)
      definition.queue.splice(0, 0, index);
    else
      _invokeAction(definition, index);
  }

  function _queue(definition, index) {
    if (definition.animating)
      definition.queue.push(index);
    else
      _invokeAction(definition, index);
  }

  function _invokeAction(definition, index) {
    var column = definition.root.find('.column').get(index);

    if (!definition.activeTile)
      _activateTile(definition, column, index);
    else if (definition.activeTile.column === index)
      _unselectTile(definition);
    else
      _moveTileTo(definition, column, index);
  }

  function _activateTile(definition, column, index) {
    var tile = column.find('.tile').get(0);
    if (!tile)
      return;

    var activeTile = definition.board[index][0];
    tile.addClass('active');

    _animate(definition, activeTile, { top: 0 }, function() {
      definition.activeTile = activeTile;
    });
  }

  function _unselectTile(definition) {
    _animate(definition, definition.activeTile, { top: 'initial' }, function() {
      definition.activeTile.nodes.tile.removeClass('active');
      definition.activeTile = null;
    });
  }

  function _moveTileTo(definition, column, index) {
    if (!_isAbleToMove(definition, index))
      return;

    var activeTile = definition.activeTile;

    // TODO think about left;
    _animate(definition, definition.activeTile, { left: 200 }, function() {
      definition.board[activeTile.column].remove(activeTile);
      definition.board[index].splice(0, 0, activeTile);

      activeTile.column = index;
      activeTile.nodes.column = column;

      column.prepend(activeTile.nodes.tile);

      _queueFirst(definition, index);
    });
  }

  function _animate(definition, tileDefinition, style, callback) {
    definition.animating = true;

    var initial = {};
    var steps = {};

    Object.keys(style).each(function() {
      console.log(tileDefinition);

      initial[this] = tileDefinition.nodes.tile.style(this);

      console.log(initial);

      // steps[this] = initial[this] - style[this];
    });

    var interval = setInterval(function() {

      _animationCallback();
    }, 10);

    function _animationCallback() {
      if (typeof callback === 'function')
        callback();

      definition.animating = false;
      _invokeNext(definition);
    }
  }

  function _invokeNext(definition) {
    if (definition.queue.length === 0)
      return;

    _invokeAction(definition, definition.queue.shift());
  }

  function _isAbleToMove(definition, index) {
    var column = definition.board[index];

    if (column.length === 0)
      return true;

    return definition.activeTile.tile < column[0].tile;
  }
})($, document, window);