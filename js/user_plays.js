;(function($, document, window, undefined) {
  'use strict';

  $.user = {
    register: _register
  }

  // functions
  function _register(game) {
    if (game.player.type !== 'human')
      return;

    game.root.live('click', '.column-container', _selectTile(game.player));
    // $(document).on('keypress', _addShortcutsToTiles);
  }

  function _addShortcutsToTiles(event) {
    var number = String.fromCharCode(event.which);

    if (!number.match(/^[1-3]$/g))
      return;

    var index = parseInt(number, 10) - 1;
    $('.game-container .column').get(index).trigger('click');
  }

  function _selectTile(player) {
    return function() {
      var index = this.find('.column').get(0).data('column');
      $.game.selectTile(player.id, index);
    };
  }
})($, document, window);