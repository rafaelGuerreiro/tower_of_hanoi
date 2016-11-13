;(function($, document, window, undefined) {
  'use strict';

  var MIN_TILES = 3;
  var MAX_TILES = 9;
  var PLAYERS_LIMIT = 2;

  var players = 0;

  var $body = $(document.body);
  var $container = $('.game-setup-container');

  (function init() {
    _createAddNewSetupConfigurationBox();
    _createNewSetupConfigurationBox(true, 0);

    $body.live('click', '.add-new-player-box', _createNewSetupConfigurationBox);
    $body.live('click', '.setup-selection-container .close', _removeSetupConfigurationBox);
    $body.live('change', '.setup-selection-container .player-type', _toggleShortcutBox);
  })();

  // functions
  function _createNewSetupConfigurationBox(arg1, arg2) {
    players++;
    $container.find('.new-player-box').insertBefore(_buildSetupConfigurationBox(arg1, arg2));

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

  function _buildSetupConfigurationBox(hideCloseButton, id) {
    if (id !== 0)
      id = 1;

    var setupBox = [
      '<div class="player-setup" data-id="',
      id,
      '">',
      '<fieldset><div class="row">',
      '<label class="col-xs-12"><input type="text" class="player-name form-control" placeholder="Player name" /></label>',
      '<label class="col-xs-6"><select class="tiles-amount form-control">',
      '<option value="0">Select the amount of tiles</option>'
    ];

    if (hideCloseButton !== true)
      setupBox.splice(0, 0, '<button class="close" tabindex="-1">&times;</button>');

    for (var amount = MIN_TILES; amount <= MAX_TILES; amount++) {
      setupBox.push('<option value="');
      setupBox.push(amount);
      setupBox.push('">');
      setupBox.push(amount);
      setupBox.push(' tiles</option>');
    }

    setupBox.push('</select></label>');
    setupBox.push('<label class="col-xs-6"><select class="player-type form-control">');
    setupBox.push('<option value="0" data-has-shortcut="true">Select the player type</option>');

    // Add players and shortcuts
    [
      { text: 'Human', hasShortcut: true },
      { text: 'Computer (easy)', hasShortcut: false },
      { text: 'Computer (medium)', hasShortcut: false },
      { text: 'Computer (hard)', hasShortcut: false }
    ].each(function(index) {
      setupBox.push('<option value="');
      setupBox.push(index + 1);
      setupBox.push('" data-has-shortcut="');
      setupBox.push(this.hasShortcut);
      setupBox.push('">');
      setupBox.push(this.text);
      setupBox.push('</option>');
    });

    setupBox.push('</select></label></div>');
    setupBox.push('<div class="shortcut-definition-container"><hr /><div class="row"><div class="col-xs-12">Shortcuts</div>');

    var number = id === 0;
    [
      { placeholder: 'First', data: number ? 1 : 'i' },
      { placeholder: 'Second', data: number ? 2 : 'o' },
      { placeholder: 'Third', data: number ? 3 : 'p' }
    ].each(function(index) {
      setupBox.push('<label class="shortcut-definition col-xs-4">');
      setupBox.push(this.placeholder);
      setupBox.push(' column<input type="text" maxlength="1" class="form-control" data-column="');
      setupBox.push(index);
      setupBox.push('" value="');
      setupBox.push(this.data);
      setupBox.push('" /></label>');
    });

    setupBox.push('</div></div></fieldset></div>');

    return _surroundConfigurationBox(setupBox);
  }

  function _buildAddSetupConfigurationBox() {
    return _surroundConfigurationBox([
      '<div class="add-new-player-box">',
      '<div class="add-new-player-helper-text">Add second player.</div>',
      '<div class="add-new-player-plus-sign"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>',
      '</div>'
    ], 'new-player-box');
  }

  function _surroundConfigurationBox(content, clazz) {
    if (clazz === undefined || clazz === null || clazz.length === 0)
      clazz = '';

    var surrounding = [
      '<div class="setup-selection-container col-xs-12 col-sm-6 ',
      clazz,
      '">',
      '</div>'
    ];

    Array.prototype.splice.apply(surrounding, [surrounding.length - 1, 0].concat(content));
    return surrounding.join('');
  }

  function _toggleShortcutBox() {
    var value = this.val();
    var hasShortcut = this.find('option[value="' + value + '"]').data('hasShortcut')[0];
    this.closest('fieldset').find('.shortcut-definition-container').toggleClass('hide', !hasShortcut);
  }

})($, document, window);