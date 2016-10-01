;(function($, document, window, undefined) {
  'use strict';

  $('.play-for-me').on('click', _startPlaying);

  // functions

  function _startPlaying() {
    _disableUserInputs();
  }

  function _stopPlaying() {
    _enableUserInputs();
  }

  function _disableUserInputs() {
    $.user.disableUserInputs();
  }

  function _enableUserInputs() {
    $.user.enableUserInputs();
  }
})($, document, window);