// This is a custom made framework just to make the development less verbose.
;(function(document, window, undefined) {
  'use strict';

  window.$ = querySelectorAll;

  // main functions

  function querySelectorAll(selector, parent) {
    if ()

    if (typeof parent === 'string')
      parent = querySelectorAll(parent);

    return document.querySelectorAll(selector);
  }

  // helper functions

  function isEmpty(value) {
    if (!value)
      return true;

    return value;
  }

})(document, window);