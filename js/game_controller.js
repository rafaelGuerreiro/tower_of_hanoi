;(function($, document, window, undefined) {
  'use strict';

  var game = [[], [], []];

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
    _selectTile(this);
  });

  // functions
  function _selectTile(column) {
    column.find('.tile')[0].toggleClass('active');
  }
})($, document, window);