(function() {
  'use strict';

  // Enforce that the script is only run on search result pages (Google Search or Google Scholar)
  // #todo change to Bing Search Results
  var isResultsPage = document.querySelector('html[xmlns\\:web="http://schemas.live.com/Web/"]');
  if (!isResultsPage) {
    // console.log('not entered');
    return;
  }

 // console.log('entered');

  // Globals
  var KEYS = {UP: 38, DOWN: 40, TAB: 9, J: 74, K: 75, SLASH: 191, ESC: 27};

  // Load options
  shortcuts.loadOptions(function(options) {

    // Styling is present
    if (options.styleSelectedSimple || options.styleSelectedFancy) {
      document.body.classList.add('useHighlight');
    }
    // Add simple highlight
    if (options.styleSelectedSimple) {
      document.body.classList.add('useSimpleHighlight');
    }
    // Add fancy highlight
    if (options.styleSelectedFancy) {
      document.body.classList.add('useFancyHighlight');
    }

    // #todo change to Bing Search Box
    var searchbox = document.querySelector("input.b_searchbox#sb_form_q, textarea.b_searchbox#sb_form_q");

    window.addEventListener('keydown', function(e) {
      e = e || window.event;

      var isInputOrModifierActive = shortcuts.isInputActive() || shortcuts.hasModifierKey(e),

          // From https://stackoverflow.com/questions/12467240/determine-if-javascript-e-keycode-is-a-printable-non-control-character
          isPrintable = (e.keyCode > 47 && e.keyCode < 58)   || // number keys
                        (e.keyCode > 64 && e.keyCode < 91)   || // letter keys
                        (e.keyCode > 95 && e.keyCode < 112)  || // numpad keys
                        (e.keyCode > 185 && e.keyCode < 193) || // ;=,-./` (in order)
                        (e.keyCode > 218 && e.keyCode < 223),   // [\]' (in order)

          shouldNavigateNext = (options.navigateWithArrows && e.keyCode == KEYS.DOWN && !isInputOrModifierActive) ||
                               (options.navigateWithTabs   && e.keyCode == KEYS.TAB  && !e.shiftKey) ||
                               (options.navigateWithJK     && e.keyCode == KEYS.J    && !isInputOrModifierActive),

          shouldNavigateBack = (options.navigateWithArrows && e.keyCode == KEYS.UP   && !isInputOrModifierActive) ||
                               (options.navigateWithTabs   && e.keyCode == KEYS.TAB  && e.shiftKey) ||
                               (options.navigateWithJK     && e.keyCode == KEYS.K    && !isInputOrModifierActive),

          shouldActivateSearch = !isInputOrModifierActive && (
                                    (options.activateSearch === true && isPrintable) ||
                                    (options.activateSearch !== false && e.keyCode === options.activateSearch)
                                 ),
          shouldActivateSearchAndHighlightText = !isInputOrModifierActive && options.selectTextInSearchbox && e.keyCode == KEYS.ESC;

      if (shouldNavigateNext || shouldNavigateBack) {
        e.preventDefault();
        e.stopPropagation();
        shortcuts.focusResult(shouldNavigateNext ? 1 : -1);
      }
      else if (shouldActivateSearch) {
        // Otherwise, force caret to end of text and focus the search box
        searchbox.value = searchbox.value + " ";
        searchbox.focus();
        // console.log('focused-1');
      }
      else if (shouldActivateSearchAndHighlightText) {
            window.scrollTo(0, 0);
            searchbox.select();
            searchbox.focus();
            // console.log('focused-2');
        }
    });

    window.addEventListener('keyup', function(e) {
      e = e || window.event;

      // if (!shortcuts.isInputActive() && !shortcuts.hasModifierKey(e) && options.navigateWithJK && e.keyCode == KEYS.SLASH) {
      if (!shortcuts.isInputActive() && options.focusWithSlash && e.keyCode == 55) {
        searchbox.value = searchbox.value + " ";
        searchbox.focus();
        // console.log('focused-3');
      }
    });

    // Auto select the first search result
    if (options.autoselectFirst === true) {
      shortcuts.focusResult(1);
    }

  });

})();
