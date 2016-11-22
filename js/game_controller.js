;(function($, document, window, undefined) {
  'use strict';

  var playerDefinitions, isPlayEnabled, isGameOver;

  $.game = {
    addPlayer: _addPlayer,
    selectTile: _selectTile,
    atomicMoveTile: _atomicMoveTile,
    listen: _listen
  };

  var events = {
    play: [],
    pause: [],
    move: [ _didWin ],
    win: []
  };

  var $container = $('.game-container');

  (function init() {
    _initializeVariables();

    $(document).live('click', '.play-controller', _togglePlay)
      .live('click', '.quit', _quit);
  })();

  // functions
  function _initializeVariables() {
    playerDefinitions = {};

    isPlayEnabled = false;
    isGameOver = false;
  }

  function _quit() {
    var playButton = $('.play-controller').attr('disabled', false);
    playButton.hasClass('pause') && playButton.trigger('click');

    $.timer.quit();
    $.movement.quit();
    $.computer.quit();

    _initializeVariables();
    $('.game-main-container, .game-winner').addClass('hide');
    $container.setInnerHtml('');

    $('.game-setup').removeClass('hide');
  }

  function _togglePlay() {
    this.blur();

    if (this.matches('[disabled="disabled"]'))
      return;

    var isPlay = this.hasClass('play');

    this.toggleClass('play pause btn-success btn-warning');
    isPlayEnabled = isPlay;

    if (isPlay)
      _trigger('play');
    else
      _trigger('pause');
  }

  function _addPlayer(player) {
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
      root: $('.game-container').find('.game-board[data-id="' + player.id + '"]').closest('.game-board-container').get(0)
    };

    if (player.type === 'human')
      $.user.register(definition);
    else
      $.computer.register(definition);

    playerDefinitions[player.id] = definition;
  }

  function _buildGameSetup(player) {
    var gameSetup = [
      '<div class="game-board-container"><div class="row">',
      '<h3 class="col-xs-8">',
      _htmlSafe(player.name),
      '</h3><div class="col-xs-4 moves">Moves: <span class="moves-counter">0</span></div></div>',
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

  function _selectTile(definition, index, callback) {
    if (!isPlayEnabled)
      return;

    if (_isColumnInvalid(index))
      return;

    _queue(definition, index, callback);
  }

  function _atomicMoveTile(definition, from, target, callback) {
    if (!isPlayEnabled)
      return;

    if (_isColumnInvalid(from) || _isColumnInvalid(target))
      return;

    _queueAtomic(definition, from, target, callback);
  }

  function _isColumnInvalid(index) {
    return typeof index !== 'number' || index > 2 || index < 0;
  }

  function _queueAtomic(definition, from, target, callback) {
    var action = {
      index: from,
      invokeNext: false,
      callback: function() {
        _invokeAction(definition, {
          index: target,
          invokeNext: true,
          callback: callback
        });
      }
    };

    if (definition.animating)
      definition.queue.push(action);
    else
      _invokeAction(definition, action);
  }

  function _queue(definition, index, callback) {
    var action = { index: index, invokeNext: true, callback: callback };

    if (definition.animating)
      definition.queue.push(action);
    else
      _invokeAction(definition, action);
  }

  function _invokeAction(definition, action) {
    var index = action.index;
    var invokeNext = action.invokeNext;
    var callback = action.callback;

    var column = definition.root.find('.column').get(index);
    if (!definition.activeTile)
      _activateTile(definition, column, index, invokeNext, callback);
    else if (definition.activeTile.column === index)
      _unselectTile(definition, invokeNext, callback);
    else
      _moveTileTo(definition, column, index, invokeNext, callback);
  }

  function _activateTile(definition, column, index, invokeNext, callback) {
    var tile = column.find('.tile').get(0);
    if (!tile)
      return;

    var activeTile = definition.board[index][0];
    tile.addClass('active animating');

    var column = activeTile.nodes.column;

    var style = {
      left: _calculateRelativePosition(tile, column, 'left', 'width'),
      top: 25
    };
    tile.style('left', style.left);

    _animate(definition, activeTile, style, invokeNext, function() {
      definition.activeTile = activeTile;
    }, callback);
  }

  function _unselectTile(definition, invokeNext, callback) {
    var tile = definition.activeTile.nodes.tile;
    var column = definition.activeTile.nodes.column;

    var style = {
      left: _calculateRelativePosition(tile, column, 'left', 'width'),
      top: _calculateRelativePosition(tile, column, 'top')
    };

    _animate(definition, definition.activeTile, style, invokeNext, function() {
      tile.removeClass('active animating').removeStyle('top');
      definition.activeTile = null;
    }, callback);
  }

  function _moveTileTo(definition, column, index, invokeNext, callback) {
    if (!_isAbleToMove(definition, index))
      return;

    var activeTile = definition.activeTile;
    var tile = activeTile.nodes.tile;

    var style = {
      left: _calculateRelativePosition(tile, column, 'left', 'width'),
      top: _calculateRelativePosition(tile, column, 'top')
    };

    _animate(definition, definition.activeTile, style, invokeNext, function() {
      definition.board[activeTile.column].remove(activeTile);
      definition.board[index].splice(0, 0, activeTile);

      activeTile.column = index;
      activeTile.nodes.column = column;

      var tile = activeTile.nodes.tile;
      column.prepend(tile.removeStyle('left'));

      tile.removeClass('active animating').removeStyle('top');
      definition.activeTile = null;

      _trigger('move', definition);
    }, callback);
  }

  function _calculateRelativePosition(tile, column, position, sizing) {
    var center = 0;
    if (typeof sizing === 'string') {
      var half = tile.getBoundingClientRect(sizing) / 2;
      center = (column.getBoundingClientRect(sizing) / 2) - half;
    }

    var col = column.getBoundingClientRect(position);
    var tileContainer = tile.closest('.column-container').get(0).getBoundingClientRect(position);

    return col - tileContainer + center;
  }

  function _animate(definition, tileDefinition, style, invokeNext) {
    definition.animating = true;

    var initial = {};
    var actual = {};
    var steps = {};

    var times = 0;

    var tile = tileDefinition.nodes.tile;
    var columnContainer = tile.closest('.column-container').get(0);

    var keys = Object.keys(style).each(function() {
      initial[this] = tile.getBoundingClientRect(this) - columnContainer.getBoundingClientRect(this);
      initial[this] += _asNumber(tile.style('margin-' + this));

      actual[this] = initial[this];

      steps[this] = _asNumber(style[this]) - _asNumber(initial[this]);

      times += Math.abs(steps[this]);
    });

    times = Math.floor(times / keys.length);
    if (times > 25) times = 25;

    keys.each(function() {
      steps[this] = steps[this] / times;
    });

    var callbacks = Array.prototype.slice.call(arguments, 4);

    var interval = setInterval(function() {
      var isDone = false;

      keys.each(function() {
        var step = steps[this];

        actual[this] += step;
        tile.style(this, actual[this]);

        isDone = isDone ||
          (step > 0 && style[this] <= actual[this]) ||
          (step < 0 && style[this] >= actual[this]);
      });

      if (isDone || isGameOver) {
        clearInterval(interval);
        _animationCallback(definition, callbacks, invokeNext);
      }
    }, 2);
  }

  function _animationCallback(definition, callbacks, invokeNext) {
    definition.animating = false;

    if (Array.isArray(callbacks))
      for (var index = 0; index < callbacks.length; index++) {
        var callback = callbacks[index];
        if (typeof callback === 'function')
          callback(definition);
      }

    if (invokeNext)
      _invokeNext(definition);
  }

  function _asNumber(number) {
    if (!isNaN(number))
      return Number(number);

    if (typeof number === 'string')
      return _asNumber(number.replace(/[^\d|\.]/gi, ''));

    return 0;
  }

  function _invokeNext(definition) {
    if (definition.queue.length === 0)
      return;

    var action = definition.queue.shift();
    _invokeAction(definition, action);
  }

  function _isAbleToMove(definition, index) {
    var column = definition.board[index];

    if (column.length === 0)
      return true;

    return definition.activeTile.tile < column[0].tile;
  }

  function _listen(name, fn) {
    if (!$.isStringPresent(name) || typeof fn !== 'function')
      return $.game;

    if (Object.keys(events).indexOf(name) < 0)
      return $.game;

    events[name].push(fn);
    return $.game;
  }

  function _trigger(name) {
    if (!$.isStringPresent(name))
      return $.game;

    if (Object.keys(events).indexOf(name) < 0)
      return $.game;

    var args = Array.prototype.slice.call(arguments, 1);
    events[name].each(function() {
      try {
        return this.apply(window, args)
      } catch(e) {
        // silence the error.
        // this is to enable the execution of other callbacks.
        $.log(e);
      }
    });
    return $.game;
  }

  function _didWin(definition) {
    if (definition.board[2].length !== definition.player.tiles || isGameOver)
      return;

    $('.play-controller').trigger('click').attr('disabled', true);
    isGameOver = true;

    _displayWinner(definition);
  }

  function _displayWinner(definition) {
    var $winner = $('.game-winner').removeClass('hide');
    $winner.find('.game-winner-name').setInnerText(definition.player.name);
  }
})($, document, window);