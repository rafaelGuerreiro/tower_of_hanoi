;(function($, document, window, undefined) {
  'use strict';

  var shortcuts = null;

  $.user = {
    register: _register
  }

  // functions
  function _register(definition) {
    if (definition.player.type !== 'human')
      return;

    definition.root.live('click', '.column-container', _selectTile(definition));
    _mapShortcuts(definition);
  }

  function _mapShortcuts(definition) {
    if (shortcuts === null) {
      shortcuts = {};
      $(document).on('keypress', _triggerShortcut);
    }

    definition.player.shortcuts.each(function(index) {
      var key = _asKey(this);

      console.log(key);

      shortcuts[key] = definition.root.find('.column').get(index);
    });

    console.log(shortcuts);
  }

  function _asKey(value) {
    return '_' + value.substring(0, 1).toLowerCase().replace(/[^0-9a-zA-Z]/gi, '$');
  }

  function _triggerShortcut(event) {
    if (shortcuts === null)
      return;

    var key = _asKey(String.fromCharCode(event.which));

    console.log(key);

    if (Object.keys(shortcuts).indexOf(key) === -1)
      return;

    console.log(shortcuts[key]);
    shortcuts[key].trigger('click');
  }

  function _selectTile(definition) {
    return function() {
      var index = this.find('.column').get(0).data('column');
      $.game.selectTile(definition, index);
    };
  }
})($, document, window);