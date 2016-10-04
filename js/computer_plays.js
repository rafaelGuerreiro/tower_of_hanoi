;(function($, document, window, undefined) {
  'use strict';

  var $buttons = $('button.autoplay');

  var $start = $buttons.filter('.start-autoplay').on('click', _startPlaying);
  var $stop = $buttons.filter('.stop-autoplay').on('click', _stopPlaying);

  // functions

  function _startPlaying() {
    _disableUserInputs();

    $buttons.toggleClass('hide');
  }

  function _stopPlaying() {
    _enableUserInputs();

    $buttons.toggleClass('hide');
  }

  function _disableUserInputs() {
    $.user.disableUserInputs();
  }

  function _enableUserInputs() {
    $.user.enableUserInputs();
  }
})($, document, window);