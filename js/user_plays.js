;(function($, document, window, undefined) {
  'use strict';

  $(document).on('keypress', _addShortcutsToTiles);
  $('.game-container').live('click', '.column-container', _selectTile);

  var userInputsEnabled = true;

  $.user = {
    enableUserInputs: _enableUserInputs,
    disableUserInputs: _disableUserInputs
  }

  // functions
  function _addShortcutsToTiles(event) {
    if (!userInputsEnabled)
      return;

    var number = String.fromCharCode(event.which);

    if (!number.match(/^[1-3]$/g))
      return;

    var index = parseInt(number, 10) - 1;
    $('.game-container .column').get(index).trigger('click');
  }

  function _selectTile() {
    if (!userInputsEnabled)
      return;

    var index = this.find('.column').get(0).data('column');
    $.game.selectTile(index);
  }

  function _enableUserInputs() {
    userInputsEnabled = true;
  }

  function _disableUserInputs() {
    userInputsEnabled = false;
  }
})($, document, window);