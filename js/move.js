;(function($, document, window, undefined) {
  'use strict';

  (function initialize() {
    $.game.listen('move', _countMove);
  })();

  function _countMove(definition) {
    if (definition.move === undefined)
      definition.move = { counter: 0 };

    definition.move.counter++;
    _updateMovesCounter(definition);
  }

  function _updateMovesCounter(definition) {
    definition.root.find('.moves-counter').setInnerText('' + definition.move.counter);
  }
})($, document, window);