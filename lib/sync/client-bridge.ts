/**
 * Generates the synchronization client bridge script to be injected into proxied HTML
 * or served directly as a standalone integration script.
 */

export function generateBridgeScript(options: {
  targetUrl: string;
  uid: string;
  sessionId?: string;
}): string {
  const { targetUrl, uid, sessionId = "rwp-default-session" } = options;

  return `
<script id="rwp-sync-bridge">
(function() {
  if (window.__RWP_INJECTED) return;
  window.__RWP_INJECTED = true;

  var TARGET_URL_STR = ${JSON.stringify(targetUrl)};
  var FRAME_UID = ${JSON.stringify(uid)};
  var SESSION_ID = ${JSON.stringify(sessionId)};

  // Remove cross-origin <base> tag so history.pushState / history.replaceState
  // in React Router, Next.js, and client-side SPAs do not throw cross-origin SecurityErrors.
  try {
    var baseEl = document.querySelector('base');
    if (baseEl) baseEl.remove();
  } catch (e) {}

  // Preserve full URL path, query params, and hash without forcing navigation to homepage.
  try {
    if (window.location.pathname.startsWith('/api/proxy')) {
      var targetObj = new URL(TARGET_URL_STR);
      var desiredPath = (targetObj.pathname || '/') + (targetObj.search || '') + (targetObj.hash || '');
      window.history.replaceState(window.history.state, '', desiredPath);
    }
  } catch (err) {
    // ignore
  }

  // ── VISIBILITY REPAIR ──────────────────────────────────────────────────────
  // Many sites use scroll-reveal / entrance animations that start elements at
  // opacity:0 or transform:translateY(...) and animate them in on scroll or
  // IntersectionObserver. Inside an iframe the IntersectionObserver root is the
  // iframe window, so elements are already "in view" — but some libraries only
  // fire after certain lifecycle events. We wait for the page to fully settle
  // then forcibly make any still-hidden animated elements fully visible.
  var isRepairing = false;
  function repairVisibility() {
    if (isRepairing) return;
    isRepairing = true;
    try {
      var style = document.getElementById('rwp-visibility-fix');
      if (!style) {
        style = document.createElement('style');
        style.id = 'rwp-visibility-fix';
        style.textContent = [
          'html, body { display: block !important; visibility: visible !important; opacity: 1 !important; }',
          'div[style*="opacity:0"], div[style*="opacity: 0"], div[style*="opacity: 0."], div[style*="opacity:0."] { opacity: 1 !important; transform: none !important; transition: none !important; }',
          'section[style*="opacity:0"], section[style*="opacity: 0"], main[style*="opacity:0"], main[style*="opacity: 0"] { opacity: 1 !important; transform: none !important; transition: none !important; }',
          'article[style*="opacity:0"], article[style*="opacity: 0"], header[style*="opacity:0"], header[style*="opacity: 0"] { opacity: 1 !important; transform: none !important; transition: none !important; }',
          '[data-aos] { opacity: 1 !important; transform: none !important; transition-duration: 0ms !important; }',
          '.wow { visibility: visible !important; opacity: 1 !important; animation: none !important; }',
          '.is-hidden, [class*="hidden-"], [class*="-hidden"] { opacity: 1 !important; visibility: visible !important; }',
          '[style*="visibility:hidden"], [style*="visibility: hidden"] { visibility: visible !important; opacity: 1 !important; }',
          '.loader-overlay, .page-loader, .site-loader, #loader, #page-loader { display: none !important; }',
        ].join(' ');
        (document.head || document.documentElement).appendChild(style);
      }

      var allEls = document.querySelectorAll('[style]');
      for (var i = 0; i < allEls.length; i++) {
        var el = allEls[i];
        var st = el.style;
        if (st) {
          var op = parseFloat(st.opacity);
          if (!isNaN(op) && op === 0) {
            st.opacity = '1';
            st.transform = 'none';
            st.transition = 'none';
            st.visibility = 'visible';
          }
          if (st.visibility === 'hidden') {
            st.visibility = 'visible';
          }
        }
      }
    } catch (e) {
    } finally {
      isRepairing = false;
    }
  }

  function triggerLayoutEvents() {
    try {
      repairVisibility();
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    } catch (e) {}
  }

  // Run immediately in case elements are already in the DOM
  repairVisibility();

  // Run again after DOMContentLoaded and load to catch anything deferred
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerLayoutEvents);
  }
  window.addEventListener('load', triggerLayoutEvents);

  // Run progressive triggers to catch JS-driven entrance animations
  setTimeout(triggerLayoutEvents, 150);
  setTimeout(triggerLayoutEvents, 400);
  setTimeout(triggerLayoutEvents, 800);
  setTimeout(triggerLayoutEvents, 1600);

  // MutationObserver to catch elements dynamically inserted or updated by client-side hydration
  try {
    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      var mutObs = new MutationObserver(function() {
        repairVisibility();
      });
      mutObs.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      setTimeout(function() { mutObs.disconnect(); }, 8000);
    }
  } catch (e) {}

  // Hook fetch & XHR so relative API calls from the previewed page route through proxy without CORS failures
  try {
    var originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function(input, init) {
        try {
          if (typeof input === 'string') {
            if (input.startsWith('/') && !input.startsWith('//') && !input.startsWith('/api/proxy')) {
              var full = new URL(input, TARGET_URL_STR).href;
              input = '/api/proxy?url=' + encodeURIComponent(full);
            }
          } else if (input && typeof input === 'object' && 'url' in input) {
            if (typeof input.url === 'string' && input.url.startsWith(window.location.origin + '/') && !input.url.includes('/api/proxy')) {
              var rel = input.url.slice(window.location.origin.length);
              var full2 = new URL(rel, TARGET_URL_STR).href;
              input = new Request('/api/proxy?url=' + encodeURIComponent(full2), input);
            }
          }
        } catch (e) {}
        return originalFetch.call(this, input, init);
      };
    }

    var originalXhrOpen = XMLHttpRequest.prototype.open;
    if (originalXhrOpen) {
      XMLHttpRequest.prototype.open = function(method, url) {
        try {
          if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/api/proxy')) {
            var fullXhr = new URL(url, TARGET_URL_STR).href;
            url = '/api/proxy?url=' + encodeURIComponent(fullXhr);
          }
        } catch (e) {}
        return originalXhrOpen.apply(this, arguments);
      };
    }

    // Hook dynamically created elements (Vite chunk loaders, lazy CSS, dynamic scripts & images)
    var originalLinkHref = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');
    if (originalLinkHref && originalLinkHref.set) {
      Object.defineProperty(HTMLLinkElement.prototype, 'href', {
        set: function(val) {
          try {
            if (typeof val === 'string' && val.startsWith('/') && !val.startsWith('//') && !val.startsWith('/api/proxy')) {
              val = new URL(val, TARGET_URL_STR).href;
            }
          } catch(e) {}
          return originalLinkHref.set.call(this, val);
        },
        get: originalLinkHref.get,
        configurable: true
      });
    }

    var originalScriptSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
    if (originalScriptSrc && originalScriptSrc.set) {
      Object.defineProperty(HTMLScriptElement.prototype, 'src', {
        set: function(val) {
          try {
            if (typeof val === 'string' && val.startsWith('/') && !val.startsWith('//') && !val.startsWith('/api/proxy')) {
              val = new URL(val, TARGET_URL_STR).href;
            }
          } catch(e) {}
          return originalScriptSrc.set.call(this, val);
        },
        get: originalScriptSrc.get,
        configurable: true
      });
    }

    var originalImgSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (originalImgSrc && originalImgSrc.set) {
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set: function(val) {
          try {
            if (typeof val === 'string' && val.startsWith('/') && !val.startsWith('//') && !val.startsWith('/api/proxy')) {
              val = new URL(val, TARGET_URL_STR).href;
            }
          } catch(e) {}
          return originalImgSrc.set.call(this, val);
        },
        get: originalImgSrc.get,
        configurable: true
      });
    }

    var originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, val) {
      try {
        var lower = String(name).toLowerCase();
        if ((lower === 'href' || lower === 'src') && typeof val === 'string') {
          if (val.startsWith('/') && !val.startsWith('//') && !val.startsWith('/api/proxy')) {
            val = new URL(val, TARGET_URL_STR).href;
          }
        }
      } catch (e) {}
      return originalSetAttribute.call(this, name, val);
    };
  } catch (err) {}

  // ── 2. STATE & DEDUPLICATION GUARDS ─────────────────────────────────────────
  var isApplyingExternal = false;
  var externalResetTimer = null;
  var currentSyncMode = 'all'; // 'all' | 'scroll-only' | 'disabled'

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
        uid: FRAME_UID,
        type: type,
        data: data,
        timestamp: Date.now()
      }, '*');
    } catch (e) {}
  }

  // ── 3. ELEMENT DESCRIPTOR BUILDER ───────────────────────────────────────────
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
    var href = (el.href || el.getAttribute('href') || undefined);
    if (href && typeof href === 'string') {
      try {
        var hrefUrl = new URL(href, TARGET_URL_STR);
        href = hrefUrl.pathname + hrefUrl.search + hrefUrl.hash;
      } catch (e) {}
    }

    var text = (el.innerText || el.textContent || '').trim();
    if (text.length > 80) text = text.slice(0, 80).trim();

    var placeholder = el.getAttribute('placeholder') || undefined;
    var value = typeof el.value === 'string' ? el.value : undefined;
    var checked = typeof el.checked === 'boolean' ? el.checked : undefined;

    // Detect responsive navigation elements (e.g. mobile hamburger button)
    var isResponsiveNav = false;
    var classNames = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
    if (
      ariaLabel && /menu|navigation|hamburger|nav-toggle/i.test(ariaLabel) ||
      classNames.includes('hamburger') || classNames.includes('menu-toggle') || classNames.includes('nav-toggle') ||
      el.getAttribute('aria-controls') && /menu|nav|drawer/i.test(el.getAttribute('aria-controls'))
    ) {
      isResponsiveNav = true;
    }

    // Semantic category
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

    // Build short CSS selector path
    var path = tagName;
    if (id && !/^[0-9]/.test(id) && id.length < 30) {
      path = '#' + id;
    } else {
      if (el.parentElement) {
        var parentTag = el.parentElement.tagName.toLowerCase();
        path = parentTag + ' > ' + tagName;
      }
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

  // ── 4. CROSS-DEVICE ELEMENT MATCHER ─────────────────────────────────────────
  function findMatchingElement(desc) {
    if (!desc || !desc.tagName) return null;

    // 1. Stable ID
    if (desc.id) {
      var byId = document.getElementById(desc.id);
      if (byId) return byId;
    }

    // 2. Test ID
    if (desc.testId) {
      var byTestId = document.querySelector('[data-testid="' + CSS.escape(desc.testId) + '"], [data-cy="' + CSS.escape(desc.testId) + '"]');
      if (byTestId) return byTestId;
    }

    // 3. Form input by name and type
    if (desc.name) {
      var selector = desc.tagName + '[name="' + CSS.escape(desc.name) + '"]';
      var byName = document.querySelector(selector);
      if (byName) return byName;
    }

    // 4. Link matching by href
    if (desc.tagName === 'a' && desc.href) {
      var allLinks = document.querySelectorAll('a[href]');
      for (var i = 0; i < allLinks.length; i++) {
        var a = allLinks[i];
        var aHref = a.getAttribute('href');
        if (aHref === desc.href || (a.pathname + a.search + a.hash) === desc.href) {
          return a;
        }
      }
    }

    // 5. Accessible label
    if (desc.ariaLabel) {
      var byAria = document.querySelector('[aria-label="' + CSS.escape(desc.ariaLabel) + '"]');
      if (byAria) return byAria;
    }

    // 6. Role = tab + text
    if (desc.role === 'tab' && desc.text) {
      var tabs = document.querySelectorAll('[role="tab"]');
      for (var t = 0; t < tabs.length; t++) {
        if ((tabs[t].innerText || tabs[t].textContent || '').trim().toLowerCase() === desc.text.toLowerCase()) {
          return tabs[t];
        }
      }
    }

    // 7. Button or Link matching by exact or close text
    if ((desc.tagName === 'button' || desc.tagName === 'a' || desc.role === 'button') && desc.text) {
      var tagQuery = desc.tagName === 'button' ? 'button, [role="button"]' : 'a';
      var candidates = document.querySelectorAll(tagQuery);
      var targetText = desc.text.toLowerCase();

      for (var c = 0; c < candidates.length; c++) {
        var candText = (candidates[c].innerText || candidates[c].textContent || '').trim().toLowerCase();
        if (candText === targetText) {
          return candidates[c];
        }
      }

      // Check partial text
      for (var c2 = 0; c2 < candidates.length; c2++) {
        var candText2 = (candidates[c2].innerText || candidates[c2].textContent || '').trim().toLowerCase();
        if (candText2.length > 2 && (candText2.includes(targetText) || targetText.includes(candText2))) {
          return candidates[c2];
        }
      }
    }

    // 8. Responsive navigation awareness
    // If user clicked a link on desktop navbar, find the same link on mobile (even if inside menu)
    if (desc.tagName === 'a' && desc.text) {
      var anyLinks = document.querySelectorAll('nav a, header a, a');
      for (var l = 0; l < anyLinks.length; l++) {
        var lt = (anyLinks[l].innerText || anyLinks[l].textContent || '').trim().toLowerCase();
        if (lt === desc.text.toLowerCase()) return anyLinks[l];
      }
    }

    // 9. Input by placeholder
    if (desc.placeholder) {
      var byPlaceholder = document.querySelector('input[placeholder="' + CSS.escape(desc.placeholder) + '"]');
      if (byPlaceholder) return byPlaceholder;
    }

    // 10. Fallback by selectorPath
    if (desc.selectorPath) {
      try {
        var byPath = document.querySelector(desc.selectorPath);
        if (byPath && byPath.tagName.toLowerCase() === desc.tagName) {
          return byPath;
        }
      } catch (e) {}
    }

    return null;
  }

  // ── 5. SCROLL SYNCHRONIZATION ──────────────────────────────────────────────
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

      var percentY = Math.min(1, Math.max(0, currentY / maxScrollY));
      var percentX = Math.min(1, Math.max(0, currentX / maxScrollX));

      emitToParent('SCROLL', {
        percentY: percentY,
        percentX: percentX,
        scrollY: currentY,
        scrollX: currentX
      });
    });
  }

  window.addEventListener('scroll', broadcastScroll, { passive: true });

  // ── 6. INTERACTION SYNCHRONIZATION (CLICKS, TABS, ACCORDIONS, MODALS) ──────
  document.addEventListener('click', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;

    var target = event.target;
    if (!target || target.nodeType !== 1) return;

    // Find nearest interactive element
    var interactive = target.closest('a, button, input, select, textarea, [role="button"], [role="tab"], [aria-expanded], details, [role="dialog"]');
    if (!interactive) interactive = target;

    var desc = getElementDescriptor(interactive);
    if (!desc) return;

    // If it's a tab
    if (desc.semanticCategory === 'tab') {
      emitToParent('TAB_CHANGE', {
        element: desc,
        tabText: desc.text
      });
    }

    // If it's an accordion / expandable
    if (desc.semanticCategory === 'accordion') {
      emitToParent('CHANGE', {
        element: desc,
        value: String(!desc.ariaExpanded)
      });
    }

    // Normal click
    emitToParent('CLICK', {
      element: desc,
      button: event.button,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey
    });
  }, true);

  // ── 7. FORM SYNCHRONIZATION ─────────────────────────────────────────────────
  document.addEventListener('input', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;

    var target = event.target;
    if (!target || !target.tagName) return;

    var tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      var desc = getElementDescriptor(target);
      if (!desc) return;

      emitToParent('INPUT', {
        element: desc,
        value: target.value,
        checked: target.checked,
        inputType: target.type
      });
    }
  }, true);

  document.addEventListener('change', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;

    var target = event.target;
    if (!target || !target.tagName) return;

    var tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') {
      var desc = getElementDescriptor(target);
      if (!desc) return;

      emitToParent('CHANGE', {
        element: desc,
        value: target.value,
        checked: target.checked,
        selectedIndex: target.selectedIndex
      });
    }
  }, true);

  // ── 8. NAVIGATION & HISTORY SYNCHRONIZATION ────────────────────────────────
  function handleNavigation(urlStr) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    try {
      var navUrl = new URL(urlStr || (window.location.pathname + window.location.search + window.location.hash), TARGET_URL_STR);
      emitToParent('NAVIGATE', {
        url: navUrl.href,
        pathname: navUrl.pathname,
        search: navUrl.search,
        hash: navUrl.hash,
        isSpa: true
      });
    } catch (e) {}
  }

  // Intercept pushState & replaceState
  try {
    function sanitizeHistoryUrl(u) {
      if (!u) return u;
      try {
        var str = String(u);
        if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//')) {
          var parsed = new URL(str, window.location.href);
          return (parsed.pathname || '/') + (parsed.search || '') + (parsed.hash || '');
        }
        return u;
      } catch (e) {
        return u;
      }
    }

    var originalPush = history.pushState;
    history.pushState = function(state, title, url) {
      var safeUrl = sanitizeHistoryUrl(url);
      var res;
      try {
        res = originalPush.call(this, state, title, safeUrl);
      } catch (e) {
        try { res = originalPush.call(this, state, title); } catch (e2) {}
      }
      handleNavigation(url || safeUrl);
      return res;
    };

    var originalReplace = history.replaceState;
    history.replaceState = function(state, title, url) {
      var safeUrl = sanitizeHistoryUrl(url);
      var res;
      try {
        res = originalReplace.call(this, state, title, safeUrl);
      } catch (e) {
        try { res = originalReplace.call(this, state, title); } catch (e2) {}
      }
      if (!isApplyingExternal && url && !String(url).startsWith('/api/proxy')) {
        handleNavigation(url || safeUrl);
      }
      return res;
    };

    window.addEventListener('popstate', function() {
      handleNavigation(window.location.href);
    });
  } catch (e) {}

  // ── 8b. MULTI-PAGE & STANDARD LINK NAVIGATION ──────────────────────────────
  document.addEventListener('click', function(event) {
    if (isApplyingExternal) return;

    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    var target = event.target;
    if (!target || target.nodeType !== 1) return;

    var anchor = target.tagName.toLowerCase() === 'a' ? target : target.closest('a');
    if (!anchor) return;

    var rawHref = anchor.getAttribute('href');
    if (!rawHref) return;

    // Skip empty hrefs, anchor jumps, or javascript: calls
    if (rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    if (anchor.target === '_blank') return;

    var targetFullUrl;
    try {
      targetFullUrl = new URL(rawHref, TARGET_URL_STR).href;
    } catch (e) {
      return;
    }

    // Intercept standard navigation so the browser does not navigate the iframe natively to localhost:3000
    // or cross-origin to target site directly (which triggers X-Frame-Options / CSP).
    event.preventDefault();
    if (currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') {
      window.location.href = '/api/proxy?url=' + encodeURIComponent(targetFullUrl) + (FRAME_UID ? '&uid=' + encodeURIComponent(FRAME_UID) : '');
      return;
    }

    emitToParent('NAVIGATE', {
      url: targetFullUrl,
      pathname: new URL(targetFullUrl).pathname,
      search: new URL(targetFullUrl).search,
      hash: new URL(targetFullUrl).hash,
      isSpa: false
    });
  }, false);

  document.addEventListener('submit', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;
    var form = event.target;
    if (!form || form.tagName.toLowerCase() !== 'form') return;
    var method = (form.method || 'get').toLowerCase();
    var action = form.action || window.location.href;

    if (method === 'get') {
      try {
        var formData = new FormData(form);
        var searchParams = new URLSearchParams();
        formData.forEach(function(val, key) { searchParams.append(key, String(val)); });
        var targetUrl = new URL(action, TARGET_URL_STR);
        var queryStr = searchParams.toString();
        if (queryStr) targetUrl.search = queryStr;

        setTimeout(function() {
          if (event.defaultPrevented) return;
          emitToParent('NAVIGATE', {
            url: targetUrl.href,
            pathname: targetUrl.pathname,
            search: targetUrl.search,
            hash: targetUrl.hash,
            isSpa: false
          });
        }, 15);
      } catch (e) {}
    }
  }, false);

  // ── 9. KEYBOARD SYNCHRONIZATION ─────────────────────────────────────────────
  document.addEventListener('keydown', function(event) {
    if (isApplyingExternal || currentSyncMode === 'disabled' || currentSyncMode === 'scroll-only') return;

    // Synchronize Escape (dialog close), Enter, Arrow keys
    if (['Escape', 'Enter', 'ArrowDown', 'ArrowUp', 'Tab'].includes(event.key)) {
      var active = document.activeElement;
      var desc = active ? getElementDescriptor(active) : undefined;
      emitToParent('KEY_DOWN', {
        element: desc,
        key: event.key,
        code: event.code,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      });
    }
  }, true);

  // ── 10. RECEIVE DIRECTIVES FROM PARENT PREVIEWER ────────────────────────────
  window.addEventListener('message', function(event) {
    if (!event.data || event.data.source !== 'rwp-parent') return;

    var type = event.data.type;
    var data = event.data.data;

    // Check session
    if (event.data.sessionId && event.data.sessionId !== SESSION_ID) return;

    // Handle SYNC_STATE
    if (type === 'SYNC_STATE' && data) {
      currentSyncMode = data.mode || 'all';
      return;
    }

    if (currentSyncMode === 'disabled') return;

    // Handle SCROLL
    if (type === 'SCROLL' || type === 'SCROLL_PERCENT') {
      var percentY = (data && typeof data.percentY === 'number') ? data.percentY : (typeof event.data.percentY === 'number' ? event.data.percentY : 0);
      var percentX = (data && typeof data.percentX === 'number') ? data.percentX : 0;

      var docEl = document.documentElement;
      var body = document.body;
      var scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
      var scrollW = Math.max(docEl ? docEl.scrollWidth : 0, body ? body.scrollWidth : 0);
      var clientH = window.innerHeight || (docEl ? docEl.clientHeight : 0);
      var clientW = window.innerWidth || (docEl ? docEl.clientWidth : 0);

      var maxScrollY = Math.max(0, scrollH - clientH);
      var maxScrollX = Math.max(0, scrollW - clientW);

      var targetY = Math.round(percentY * maxScrollY);
      var targetX = Math.round(percentX * maxScrollX);

      lockExternal(80);
      window.scrollTo({
        top: targetY,
        left: targetX,
        behavior: 'instant'
      });
      return;
    }

    if (type === 'SCROLL_BY') {
      var deltaY = event.data.deltaY || (data ? data.deltaY : 0) || 0;
      var deltaX = event.data.deltaX || (data ? data.deltaX : 0) || 0;

      lockExternal(80);
      window.scrollBy({
        top: deltaY,
        left: deltaX,
        behavior: 'instant'
      });
      return;
    }

    // All interaction below is skipped if scroll-only mode
    if (currentSyncMode === 'scroll-only') return;

    // Handle CLICK
    if (type === 'CLICK' && data && data.element) {
      var matched = findMatchingElement(data.element);
      if (matched) {
        lockExternal(120);
        // If responsive nav toggle, click it
        try {
          matched.focus?.();
          matched.click();
        } catch (e) {
          try {
            var clickEvt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            matched.dispatchEvent(clickEvt);
          } catch (e2) {}
        }
      } else {
        // If it was a responsive menu toggle (hamburger) on mobile, and this device is desktop (which has no hamburger), skip silently.
        if (data.element.isResponsiveNav && window.innerWidth >= 768) {
          // Desktop viewport already has full navigation visible — no action needed.
          return;
        }

        // Notify parent that matching failed
        emitToParent('MATCH_FAILED', {
          action: 'click',
          reason: 'No matching element found for "' + (data.element.text || data.element.tagName) + '" on this screen size',
          descriptor: data.element
        });
      }
      return;
    }

    // Handle INPUT
    if (type === 'INPUT' && data && data.element) {
      var inputEl = findMatchingElement(data.element);
      if (inputEl) {
        lockExternal(60);
        inputEl.value = data.value;
        if (typeof data.checked === 'boolean') inputEl.checked = data.checked;
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Handle CHANGE
    if (type === 'CHANGE' && data && data.element) {
      var changeEl = findMatchingElement(data.element);
      if (changeEl) {
        lockExternal(60);
        if (changeEl.tagName.toLowerCase() === 'details') {
          changeEl.open = data.value === 'true';
        } else if (changeEl.hasAttribute('aria-expanded')) {
          changeEl.setAttribute('aria-expanded', data.value === 'true' ? 'true' : 'false');
          changeEl.click();
        } else {
          changeEl.value = data.value;
          if (typeof data.checked === 'boolean') changeEl.checked = data.checked;
          if (typeof data.selectedIndex === 'number') changeEl.selectedIndex = data.selectedIndex;
          changeEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      return;
    }

    // Handle TAB_CHANGE
    if (type === 'TAB_CHANGE' && data && data.element) {
      var tabEl = findMatchingElement(data.element);
      if (tabEl) {
        lockExternal(100);
        tabEl.click();
      }
      return;
    }

    // Handle MODAL_CHANGE
    if (type === 'MODAL_CHANGE' && data && data.element) {
      var modalEl = findMatchingElement(data.element);
      if (modalEl) {
        lockExternal(100);
        if (modalEl.tagName.toLowerCase() === 'dialog') {
          if (data.open && typeof modalEl.showModal === 'function') modalEl.showModal();
          else if (!data.open && typeof modalEl.close === 'function') modalEl.close();
        } else {
          modalEl.click();
        }
      }
      return;
    }

    // Handle KEY_DOWN
    if (type === 'KEY_DOWN' && data) {
      var targetKeyEl = data.element ? findMatchingElement(data.element) : document.activeElement;
      if (targetKeyEl) {
        lockExternal(60);
        try {
          var kEvt = new KeyboardEvent('keydown', {
            key: data.key,
            code: data.code,
            altKey: data.altKey,
            ctrlKey: data.ctrlKey,
            shiftKey: data.shiftKey,
            metaKey: data.metaKey,
            bubbles: true,
            cancelable: true
          });
          targetKeyEl.dispatchEvent(kEvt);
        } catch (e) {}
      }
      return;
    }

    // Handle NAVIGATE (SPA & internal route sync)
    if (type === 'NAVIGATE' && data) {
      var currentPath = window.location.pathname + window.location.search + window.location.hash;
      var newPath = (data.pathname || '/') + (data.search || '') + (data.hash || '');
      if (currentPath !== newPath) {
        lockExternal(150);
        try {
          window.history.pushState(null, '', newPath);
          window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
        } catch (e) {
          // If direct navigation needed, always route through proxy
          if (data.url) {
            window.location.href = '/api/proxy?url=' + encodeURIComponent(data.url) + (FRAME_UID ? '&uid=' + encodeURIComponent(FRAME_UID) : '');
          }
        }
      }
      return;
    }
  });

  // ── 11. ANNOUNCE BRIDGE READY ──────────────────────────────────────────────
  emitToParent('BRIDGE_READY', {
    url: TARGET_URL_STR,
    title: document.title,
    deviceUid: FRAME_UID
  });

})();
</script>
`;
}
