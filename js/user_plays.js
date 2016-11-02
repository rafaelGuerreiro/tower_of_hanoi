;(function($, document, window, undefined) {
  'use strict';

  $(document).on('keypress', _selectTile);

  var userInputsEnabled = true;

  $.user = {
    enableUserInputs: _enableUserInputs,
    disableUserInputs: _disableUserInputs
  }

  // functions
  function _selectTile(event) {
    if (!userInputsEnabled)
      return;

    var number = String.fromCharCode(event.which);

    if (!number.match(/^[1-3]$/g))
      return;

    var index = parseInt(number, 10) - 1;
    $.game.play(index);
  }

  function _enableUserInputs() {
    userInputsEnabled = true;
  }

  function _disableUserInputs() {
    userInputsEnabled = false;
  }
})($, document, window);