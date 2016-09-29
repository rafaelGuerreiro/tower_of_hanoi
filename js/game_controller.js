;(function($, document, window, undefined) {
  'use strict';

  $('.game-container').live('click', '.column-container', function() {
    this.find('.tile')[0].toggleClass('active');
  });
})($, document, window);