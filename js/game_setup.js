;(function($, document, window, undefined) {
  'use strict';

  var MIN_TILES = 3;
  var MAX_TILES = 9;

  var $body = $(document.body);

  (function init() {
    _createAddNewSetupConfigurationBox();
    _createNewSetupConfigurationBox();

    $body.live('click', '.add-new-player-box', _createNewSetupConfigurationBox);
  })();

  // functions
  function _createNewSetupConfigurationBox() {
    $('.game-setup-container').prepend(_buildSetupConfigurationBox());
  }

  function _createAddNewSetupConfigurationBox() {
    $('.game-setup-container').append(_buildAddSetupConfigurationBox());
  }

  function _buildSetupConfigurationBox() {
    var setupBox = [
      '<button class="close">&times;</button>',
      '<div class="player-setup">',
      '<label><input type="text" class="player-name form-control" placeholder="Name of the player" /></label>',
      '<label><select class="tiles-amount form-control">',
      '<option value="0">Select the amount of tiles</option>'
    ];

    for (var amount = MIN_TILES; amount <= MAX_TILES; amount++) {
      setupBox.push('<option value="');
      setupBox.push(amount);
      setupBox.push('">');
      setupBox.push(amount);
      setupBox.push(' tiles</option>');
    }

    setupBox.push('</select></label>');

    // Add players and shortcuts
    setupBox.push('<fieldset>');

    [
      'human',
      'computer-easy',
      'computer-medium',
      'computer-hard'
    ].each(function() {
      setupBox.push('<div class="radio"><label><input type="radio" name="player-type" value="');
      setupBox.push(this);
      setupBox.push('" />');
      setupBox.push(this);
      setupBox.push('</label></div>');
    });

    [0, 1, 2].each(function() {
      setupBox.push('<label class="shortcut-definition"><input type="text" class="form-control" data-column="');
      setupBox.push(this);
      setupBox.push('" placeholder="');
      setupBox.push(this + 1);
      setupBox.push('" /></label>');
    });

    setupBox.push('</fieldset></div>');

    return _surroundConfigurationBox(setupBox);
  }

  function _buildAddSetupConfigurationBox() {
    return _surroundConfigurationBox([
      '<div class="add-new-player-box">',
      '<div class="add-new-player-helper-text">Add a new player.</div>',
      '<div class="add-new-player-plus-sign"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>',
      '</div>'
    ]);
  }

  function _surroundConfigurationBox(content) {
    var surrounding = [
      '<div class="setup-selection-container col-xs-12 col-sm-6 col-md-4 col-lg-3">',
      '</div>'
    ];

    Array.prototype.splice.apply(surrounding, [1, 0].concat(content));
    return surrounding.join('');
  }

})($, document, window);