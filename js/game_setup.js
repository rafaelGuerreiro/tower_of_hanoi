;(function($, document, window, undefined) {
  'use strict';

  var MIN_TILES = 3;
  var MAX_TILES = 9;
  var PLAYERS_LIMIT = 4;

  var players = 0;

  var $body = $(document.body);
  var $container = $('.game-setup-container');

  (function init() {
    _createAddNewSetupConfigurationBox();
    _createNewSetupConfigurationBox(true);

    $body.live('click', '.add-new-player-box', _createNewSetupConfigurationBox);
    $body.live('click', '.setup-selection-container .close', _removeSetupConfigurationBox);
  })();

  // functions
  function _createNewSetupConfigurationBox(arg1) {
    players++;
    $container.find('.new-player-box').insertBefore(_buildSetupConfigurationBox(arg1));

    if (players >= PLAYERS_LIMIT)
      $container.find('.new-player-box').addClass('hide');
  }

  function _removeSetupConfigurationBox() {
    players--;
    $(this).closest('.setup-selection-container').remove();

    if (players < PLAYERS_LIMIT)
      $container.find('.new-player-box').removeClass('hide');
  }

  function _createAddNewSetupConfigurationBox() {
    $container.append(_buildAddSetupConfigurationBox());
  }

  function _buildSetupConfigurationBox(hideCloseButton) {
    var setupBox = [
      '<div class="player-setup">',
      '<label><input type="text" class="player-name form-control" placeholder="Name of the player" /></label>',
      '<label><select class="tiles-amount form-control">',
      '<option value="0">Select the amount of tiles</option>'
    ];

    if (hideCloseButton !== true)
      setupBox.splice(0, 0, '<button class="close">&times;</button>');

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
    ], 'new-player-box');
  }

  function _surroundConfigurationBox(content, clazz) {
    if (clazz === undefined || clazz === null || clazz.length === 0)
      clazz = '';

    var surrounding = [
      '<div class="setup-selection-container col-xs-12 col-sm-6 col-md-4 col-lg-3 ',
      clazz,
      '">',
      '</div>'
    ];

    Array.prototype.splice.apply(surrounding, [surrounding.length - 1, 0].concat(content));
    return surrounding.join('');
  }

})($, document, window);