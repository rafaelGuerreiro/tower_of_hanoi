;(function($, document, window, undefined) {
  'use strict';

  var MIN_TILES = 3;
  var MAX_TILES = 9;

  (function init() {
    for (var setups = 0; setups < 2; setups++)
      _createNewSetupConfigurationBox();
  })();

  // functions
  function _createNewSetupConfigurationBox() {
    $('.game-setup-container').append(_buildSetupConfigurationBox());
  }

  function _buildSetupConfigurationBox() {
    var setupBox = [
      '<div class="setup-selection-container col-xs-12 col-sm-6 col-md-4 col-lg-3">',
      '<div class="tile-selection row">',
      '<label class="col-xs-12">Select the amount of tiles:<select class="tiles-amount form-control">',
      '<option value="0">Select the amount</option>'
    ];

    for (var amount = MIN_TILES; amount <= MAX_TILES; amount++) {
      setupBox.push('<option value="');
      setupBox.push(amount);
      setupBox.push('">');
      setupBox.push(amount);
      setupBox.push(' tiles</option>');
    }

    setupBox.push('</select></label></div></div>');
    return setupBox.join('');
  }

})($, document, window);