;(function($, document, window, undefined) {
  'use strict';

  var shortcuts = null;

  $.user = {
    initialize: _initialize,
    register: _register
  };

  // functions
  function _initialize() {
    if (shortcuts !== null)
      return;

    shortcuts = { '__': $('.play-controller').get(0) };
    $(document).on('keyup', _triggerShortcut);
  }

  function _register(definition) {
    if (definition.player.type !== 'human')
      return;

    definition.root.live('click', '.column-container', _selectTile(definition));
    _mapShortcuts(definition);
  }

  function _mapShortcuts(definition) {
    _initialize();

    definition.player.shortcuts.each(function(index) {
      var key = _asKey(this);
      shortcuts[key] = definition.root.find('.column').get(index);
    });
  }

  function _asKey(value) {
    if (value === ' ')
      return '__';

    return '_' + value.substring(0, 1).toLowerCase().replace(/[^0-9a-zA-Z]/gi, '$');
  }

  function _triggerShortcut(event) {
    if (shortcuts === null)
      return;

    var character = String.fromCharCode(event.which);
    var key = _asKey(character);

    if (Object.keys(shortcuts).indexOf(key) === -1)
      return;

    shortcuts[key].trigger('click');
  }

  function _selectTile(definition) {
    return function() {
      var index = this.find('.column').get(0).data('column');
      $.game.selectTile(definition, index);
    };
  }
})($, document, window);