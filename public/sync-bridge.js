/**
 * Responsive Website Previewer - Developer Integration Sync Bridge
 *
 * Include this script on websites previewed inside the Responsive Website Previewer
 * to enable full interaction synchronization (scroll, clicks, form state, tabs, navigation).
 *
 * Usage:
 *   <script src="/sync-bridge.js"></script>
 */
(function() {
  if (window.__RWP_INJECTED) return;
  window.__RWP_INJECTED = true;

  var SESSION_ID = 'rwp-default-session';
  var isApplyingExternal = false;
  var externalResetTimer = null;
  var currentSyncMode = 'all';

  function lockExternal(durationMs) {
    isApplyingExternal = true;
    if (externalResetTimer) clearTimeout(externalResetTimer);
    externalResetTimer = setTimeout(function() {
      isApplyingExternal = false;
    }, durationMs || 60);
  }

  function emitToParent(type, data) {
    if (isApplyingExternal || currentSyncMode === 'disabled') return;
    try {
      window.parent.postMessage({
        source: 'rwp-child',
        sessionId: SESSION_ID,
        type: type,
        data: data,
        timestamp: Date.now()
      }, '*');
    } catch (e) {}
  }

  function getElementDescriptor(el) {
    if (!el || el.nodeType !== 1) return null;
    var tagName = el.tagName.toLowerCase();
    var id = el.id ? String(el.id).trim() : undefined;
    var name = el.name ? String(el.name).trim() : undefined;
    var testId = el.getAttribute('data-testid') || el.getAttribute('data-cy') || el.getAttribute('data-qa') || el.getAttribute('data-id') || undefined;
    var role = el.getAttribute('role') || undefined;
    var ariaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || undefined;
    var ariaExpanded = el.hasAttribute('aria-expanded') ? el.getAttribute('aria-expanded') === 'true' : undefined;
    var type = el.type ? String(el.type).toLowerCase() : undefined;
    var href = el.href || el.getAttribute('href') || undefined;
    var text = (el.innerText || el.textContent || '').trim();
    if (text.length > 80) text = text.slice(0, 80).trim();

    var placeholder = el.getAttribute('placeholder') || undefined;
    var value = typeof el.value === 'string' ? el.value : undefined;
    var checked = typeof el.checked === 'boolean' ? el.checked : undefined;

    var isResponsiveNav = false;
    var classNames = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
    if (
      (ariaLabel && /menu|navigation|hamburger|nav-toggle/i.test(ariaLabel)) ||
      classNames.includes('hamburger') || classNames.includes('menu-toggle') || classNames.includes('nav-toggle')
    ) {
      isResponsiveNav = true;
    }

    var semanticCategory = 'other';
    if (tagName === 'a') semanticCategory = 'link';
    else if (tagName === 'button' || role === 'button') semanticCategory = 'button';
    else if (tagName === 'input') {
      if (type === 'checkbox') semanticCategory = 'checkbox';
      else if (type === 'radio') semanticCategory = 'radio';
      else semanticCategory = 'input';
    } else if (tagName === 'select') semanticCategory = 'select';
    else if (role === 'tab') semanticCategory = 'tab';
    else if (ariaExpanded !== undefined || tagName === 'details') semanticCategory = 'accordion';
    else if (role === 'dialog' || el.getAttribute('aria-modal') === 'true' || tagName === 'dialog') semanticCategory = 'modal';

    var path = tagName;
    if (id && !/^[0-9]/.test(id) && id.length < 30) {
      path = '#' + id;
    } else if (el.parentElement) {
      path = el.parentElement.tagName.toLowerCase() + ' > ' + tagName;
    }

    return {
      tagName: tagName,
      id: id,
      name: name,
      testId: testId,
      role: role,
      ariaLabel: ariaLabel,
      ariaExpanded: ariaExpanded,
      type: type,
      href: href,
      text: text,
      placeholder: placeholder,
      value: value,
      checked: checked,
      classes: (el.className && typeof el.className === 'string') ? el.className.split(/\\s+/).slice(0, 4) : [],
      selectorPath: path,
      isResponsiveNav: isResponsiveNav,
      semanticCategory: semanticCategory
    };
  }

  function findMatchingElement(desc) {
    if (!desc || !desc.tagName) return null;
    if (desc.id) {
      var byId = document.getElementById(desc.id);
      if (byId) return byId;
    }
    if (desc.testId) {
      var byTestId = document.querySelector('[data-testid="' + CSS.escape(desc.testId) + '"], [data-cy="' + CSS.escape(desc.testId) + '"]');
      if (byTestId) return byTestId;
    }
    if (desc.name) {
      var byName = document.querySelector(desc.tagName + '[name="' + CSS.escape(desc.name) + '"]');
      if (byName) return byName;
    }
    if (desc.tagName === 'a' && desc.href) {
      var allLinks = document.querySelectorAll('a[href]');
      for (var i = 0; i < allLinks.length; i++) {
        var a = allLinks[i];
        if (a.getAttribute('href') === desc.href || (a.pathname + a.search + a.hash) === desc.href) return a;
      }
    }
    if (desc.ariaLabel) {
      var byAria = document.querySelector('[aria-label="' + CSS.escape(desc.ariaLabel) + '"]');
      if (byAria) return byAria;
    }
    if (desc.role === 'tab' && desc.text) {
      var tabs = document.querySelectorAll('[role="tab"]');
      for (var t = 0; t < tabs.length; t++) {
        if ((tabs[t].innerText || tabs[t].textContent || '').trim().toLowerCase() === desc.text.toLowerCase()) return tabs[t];
      }
    }
    if ((desc.tagName === 'button' || desc.tagName === 'a' || desc.role === 'button') && desc.text) {
      var tagQuery = desc.tagName === 'button' ? 'button, [role="button"]' : 'a';
      var candidates = document.querySelectorAll(tagQuery);
      var targetText = desc.text.toLowerCase();
      for (var c = 0; c < candidates.length; c++) {
        var candText = (candidates[c].innerText || candidates[c].textContent || '').trim().toLowerCase();
        if (candText === targetText) return candidates[c];
      }
      for (var c2 = 0; c2 < candidates.length; c2++) {
        var candText2 = (candidates[c2].innerText || candidates[c2].textContent || '').trim().toLowerCase();
        if (candText2.length > 2 && (candText2.includes(targetText) || targetText.includes(candText2))) return candidates[c2];
      }
    }
    if (desc.placeholder) {
      var byPlaceholder = document.querySelector('input[placeholder="' + CSS.escape(desc.placeholder) + '"]');
      if (byPlaceholder) return byPlaceholder;
    }
    if (desc.selectorPath) {
      try {
        var byPath = document.querySelector(desc.selectorPath);
        if (byPath && byPath.tagName.toLowerCase() === desc.tagName) return byPath;
      } catch (e) {}
    }
    return null;
  }

  // Scroll sync
  var scrollRaf = null;
  function broadcastScroll() {
    if (isApplyingExternal || currentSyncMode === 'disabled') return;
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(function() {
      var docEl = document.documentElement;
      var body = document.body;
      var scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
      var scrollW = Math.max(docEl ? docEl.scrollWidth : 0, body ? body.scrollWidth : 0);
      var clientH = window.innerHeight || (docEl ? docEl.clientHeight : 0);
      var clientW = window.innerWidth || (docEl ? docEl.clientWidth : 0);

      var maxScrollY = Math.max(1, scrollH - clientH);
      var maxScrollX = Math.max(1, scrollW - clientW);

      var currentY = window.scrollY || (docEl ? docEl.scrollTop : 0) || (body ? body.scrollTop : 0) || 0;
      var currentX = window.scrollX || (docEl ? docEl.scrollLeft : 0) || (body ? body.scrollLeft : 0) || 0;

      emitToParent('SCROLL', {
        percentY: Math.min(1, Math.max(0, currentY / maxScrollY)),
        percentX: Math.min(1, Math.max(0, currentX / maxScrollX)),
        scrollY: currentY,
        scrollX: currentX
      });
    });
  }
  window.addEventListener('scroll', broadcastScroll, { passive: true });

  // Click & Tab & Accordion sync
  document.addEventListener('click', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    var target = event.target;
    if (!target || target.nodeType !== 1) return;
    var interactive = target.closest('a, button, input, select, textarea, [role="button"], [role="tab"], [aria-expanded], details, [role="dialog"]') || target;
    var desc = getElementDescriptor(interactive);
    if (!desc) return;

    if (desc.semanticCategory === 'tab') {
      emitToParent('TAB_CHANGE', { element: desc, tabText: desc.text });
    }
    if (desc.semanticCategory === 'accordion') {
      emitToParent('CHANGE', { element: desc, value: String(!desc.ariaExpanded) });
    }
    emitToParent('CLICK', { element: desc, button: event.button });
  }, true);

  // Form input & change sync
  document.addEventListener('input', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    var target = event.target;
    if (!target || !target.tagName) return;
    var tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      var desc = getElementDescriptor(target);
      if (desc) emitToParent('INPUT', { element: desc, value: target.value, checked: target.checked });
    }
  }, true);

  document.addEventListener('change', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    var target = event.target;
    if (!target || !target.tagName) return;
    var desc = getElementDescriptor(target);
    if (desc) emitToParent('CHANGE', { element: desc, value: target.value, checked: target.checked, selectedIndex: target.selectedIndex });
  }, true);

  // Navigation sync
  function handleNavigation(urlStr) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    try {
      var navUrl = new URL(urlStr || window.location.href, window.location.origin);
      emitToParent('NAVIGATE', { url: navUrl.href, pathname: navUrl.pathname, search: navUrl.search, hash: navUrl.hash, isSpa: true });
    } catch (e) {}
  }

  try {
    var originalPush = history.pushState;
    history.pushState = function(state, title, url) {
      var res = originalPush.apply(this, arguments);
      handleNavigation(url);
      return res;
    };
    var originalReplace = history.replaceState;
    history.replaceState = function(state, title, url) {
      var res = originalReplace.apply(this, arguments);
      if (!isApplyingExternal) handleNavigation(url);
      return res;
    };
    window.addEventListener('popstate', function() {
      handleNavigation(window.location.href);
    });
  } catch (e) {}

  // Message reception from parent
  window.addEventListener('message', function(event) {
    if (!event.data || event.data.source !== 'rwp-parent') return;
    var type = event.data.type;
    var data = event.data.data;

    if (type === 'SYNC_STATE' && data) {
      currentSyncMode = data.mode || 'all';
      return;
    }
    if (currentSyncMode === 'disabled') return;

    if (type === 'SCROLL' || type === 'SCROLL_PERCENT') {
      var percentY = (data && typeof data.percentY === 'number') ? data.percentY : 0;
      var percentX = (data && typeof data.percentX === 'number') ? data.percentX : 0;
      var docEl = document.documentElement;
      var body = document.body;
      var scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
      var scrollW = Math.max(docEl ? docEl.scrollWidth : 0, body ? body.scrollWidth : 0);
      var clientH = window.innerHeight || (docEl ? docEl.clientHeight : 0);
      var clientW = window.innerWidth || (docEl ? docEl.clientWidth : 0);

      lockExternal(80);
      window.scrollTo({
        top: Math.round(percentY * Math.max(0, scrollH - clientH)),
        left: Math.round(percentX * Math.max(0, scrollW - clientW)),
        behavior: 'instant'
      });
      return;
    }

    if (currentSyncMode === 'scroll-only') return;

    if (type === 'CLICK' && data && data.element) {
      var matched = findMatchingElement(data.element);
      if (matched) {
        lockExternal(120);
        try { matched.click(); } catch(e) {}
      } else {
        if (!data.element.isResponsiveNav || window.innerWidth < 768) {
          emitToParent('MATCH_FAILED', {
            action: 'click',
            reason: 'Element "' + (data.element.text || data.element.tagName) + '" not found in this preview viewport',
            descriptor: data.element
          });
        }
      }
      return;
    }

    if (type === 'INPUT' && data && data.element) {
      var inEl = findMatchingElement(data.element);
      if (inEl) {
        lockExternal(60);
        inEl.value = data.value;
        if (typeof data.checked === 'boolean') inEl.checked = data.checked;
        inEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    if (type === 'CHANGE' && data && data.element) {
      var chEl = findMatchingElement(data.element);
      if (chEl) {
        lockExternal(60);
        chEl.value = data.value;
        if (typeof data.checked === 'boolean') chEl.checked = data.checked;
        chEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    if (type === 'NAVIGATE' && data) {
      var cur = window.location.pathname + window.location.search + window.location.hash;
      var dest = (data.pathname || '/') + (data.search || '') + (data.hash || '');
      if (cur !== dest) {
        lockExternal(150);
        try {
          window.history.pushState(null, '', dest);
          window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
        } catch(e) {}
      }
    }
  });

  emitToParent('BRIDGE_READY', { url: window.location.href, title: document.title });
})();
