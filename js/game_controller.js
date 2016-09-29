;(function($, document, window, undefined) {
  'use strict';

  var game = [[], [], []];
      //
      // {
      //   nodes: {
      //     tile:
      //     column:
      //   },
      //   column:
      //   size:
      // }

  (function initialize() {
    $('.tile').each(function() {
      console.log(this.parent().data('column'));
      console.log(this.data('tile'));
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