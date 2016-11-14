;(function($, document, window, undefined) {
  'use strict';

  var MIN_TILES = 3;
  var MAX_TILES = 9;
  var PLAYERS_LIMIT = 2;

  var players = 0;

  var $body = $(document.body).get(0);
  var $setup = $('.game-setup');
  var $container = $setup.find('.game-setup-container').get(0);

  (function init() {
    _createAddNewSetupConfigurationBox();
    _createNewSetupConfigurationBox({ hideCloseButton: true, id: 0, shortcuts: [1, 2, 3] });

    $container.live('click', '.add-new-player-box', function() {
      _createNewSetupConfigurationBox({ hideCloseButton: false, id: 1, shortcuts: ['i', 'o', 'p'] });
      _toggleInitGame();
    });

    $container.live('click', '.setup-selection-container .close', _removeSetupConfigurationBox);
    $container.live('change', '.setup-selection-container .player-type', _toggleShortcutBox);

    $container.live('change keyup', '.player-setup input, .player-setup select', _toggleInitGame);

    $body.live('click', '.init-game', _initGame);
  })();

  // functions
  function _initGame() {
    $container.find('.player-setup').each(function() {
      var setup = this;
      var player = {};

      player.id = this.data('id');
      player.name = this.find('.player-name').get(0).val();
      player.tiles = this.find('.tiles-amount').get(0).val();
      player.type = this.find('.player-type').get(0).val();

      var shortcuts = false;
      if (player.type === 'human') {
        shortcuts = [
          this.find('.shortcut-0').get(0).val(),
          this.find('.shortcut-1').get(0).val(),
          this.find('.shortcut-2').get(0).val()
        ];
      }
      player.shortcuts = shortcuts;

      $.game.addPlayer(player);
    });

    $setup.addClass('hide');
    $('.game-main-container').removeClass('hide');
  }

  function _createNewSetupConfigurationBox(options) {
    players++;
    $container.find('.new-player-box').insertBefore(_buildSetupConfigurationBox(options));

    if (players >= PLAYERS_LIMIT)
      $container.find('.new-player-box').addClass('hide');

    $container.find('.player-setup[data-id="' + options.id + '"] .player-name').focus();
  }

  function _removeSetupConfigurationBox() {
    players--;
    $(this).closest('.setup-selection-container').remove();

    if (players < PLAYERS_LIMIT)
      $container.find('.new-player-box').removeClass('hide');

    _toggleInitGame();
    return false;
  }

  function _createAddNewSetupConfigurationBox() {
    $container.append(_buildAddSetupConfigurationBox());
  }

  function _buildSetupConfigurationBox(options) {
    var setupBox = [
      '<div class="player-setup" data-id="',
      options.id,
      '">',
      '<fieldset><div class="row">',
      '<label class="col-xs-12"><input type="text" class="player-name form-control" placeholder="Player name" /></label>',
      '<label class="col-xs-6"><select class="tiles-amount form-control">'
    ];

    if (!options.hideCloseButton)
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

    // Add players and shortcuts
    [
      { id: 'human', text: 'Human', hasShortcut: true },
      { id: 'easy', text: 'Computer (easy)', hasShortcut: false },
      { id: 'medium', text: 'Computer (medium)', hasShortcut: false },
      { id: 'hard', text: 'Computer (hard)', hasShortcut: false }
    ].each(function() {
      setupBox.push('<option value="');
      setupBox.push(this.id);
      setupBox.push('" data-has-shortcut="');
      setupBox.push(this.hasShortcut);
      setupBox.push('">');
      setupBox.push(this.text);
      setupBox.push('</option>');
    });

    setupBox.push('</select></label></div>');
    setupBox.push('<div class="shortcut-definition-container"><hr /><div class="row"><div class="col-xs-12">Shortcuts</div>');

    ['First', 'Second', 'Third'].each(function(index) {
      setupBox.push('<label class="shortcut-definition col-xs-4">');
      setupBox.push(this);
      setupBox.push(' column<input type="text" maxlength="1" class="form-control shortcut-' + index + '" data-column="');
      setupBox.push(index);
      setupBox.push('" value="');
      setupBox.push(options.shortcuts[index]);
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

  function _toggleInitGame() {
    var valid = _isValidToInitGame();

    $setup.find('.init-game').attr('disabled', !valid);
  }

  function _isValidToInitGame() {
    var valid = true;

    $container.find('.player-setup input, .player-setup select').each(function() {
      return valid = valid && $.isPresent(this.val());
    });

    return valid;
  }
})($, document, window);