;(function($, document, window, undefined) {
  'use strict';

  var game = [[], [], []];
  var activeTile = null;

  (function initialize() {
    $('.tile').each(function() {
      var column = this.parent();
      var columnIndex = column.data('column');
      var tileIndex = this.data('tile');

      game[columnIndex].splice(tileIndex, 0, {
        nodes: {
          tile: this,
          column: column
        },
        tile: tileIndex,
        column: columnIndex
      });
    });
  })();

  $('.game-container').live('click', '.column-container', function() {
    var column = this.children('.column').get(0);
    _selectTile(column, column.data('column'));
  });

  // functions
  function _selectTile(column, index) {
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
    game[activeTile.column].remove(activeTile);
    game[index].splice(0, 0, activeTile);

    activeTile.column = index;
    activeTile.nodes.column = column;

    column.prepend(activeTile.nodes.tile);

    _unselectTile();
  }
})($, document, window);