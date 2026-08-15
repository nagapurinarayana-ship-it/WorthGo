/* WorthGo native UX runtime hook. Visual styling lives in native-ux.css.
   This file intentionally has no event listeners or DOM rewriting. */
(() => {
  'use strict';
  document.documentElement.classList.add('wg-native-ready');
})();
