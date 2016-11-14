;(function($, document, window, undefined) {
  'use strict';

  $.user = {
    register: _register
  }

  // functions
  function _register(definition) {
    if (definition.player.type !== 'human')
      return;

    definition.root.live('click', '.column-container', _selectTile(definition));
    // $(document).on('keypress', _addShortcutsToTiles);
  }

  function _addShortcutsToTiles(event) {
    var number = String.fromCharCode(event.which);

    if (!number.match(/^[1-3]$/g))
      return;

    var index = parseInt(number, 10) - 1;
    $('.game-container .column').get(index).trigger('click');
  }

  function _selectTile(definition) {
    return function() {
      var index = this.find('.column').get(0).data('column');
      $.game.selectTile(definition, index);
    };
  }
})($, document, window);