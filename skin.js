/* ============================================
   JON HAZELTINE — Skin Loader
   One set of HTML content, many looks.
   Pick via ?skin=<name>, the floating switcher,
   or a previously saved choice (localStorage).
   ============================================ */

(function () {
  'use strict';

  var SKINS = [
    { id: 'luxe',     label: 'Luxe',     hint: 'Midnight & gold' },
    { id: 'paper',    label: 'Paper',    hint: 'Editorial print' },
    { id: 'brutal',   label: 'Brutal',   hint: 'Loud & raw' },
    { id: 'kapow',    label: 'Kapow',    hint: 'Comic-book hero' },
    { id: 'aurora',   label: 'Aurora',   hint: 'Northern lights' },
    { id: 'ivory',    label: 'Ivory',    hint: 'Sculpted & serene' }
  ];
  var DEFAULT_SKIN = 'luxe';
  var KEY = 'jh-skin';

  function validSkin(id) {
    for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return true;
    return false;
  }

  var fromUrl = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get('skin');
  } catch (e) {}
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  var skin = validSkin(fromUrl) ? fromUrl : (validSkin(saved) ? saved : DEFAULT_SKIN);
  if (validSkin(fromUrl)) {
    try { localStorage.setItem(KEY, fromUrl); } catch (e) {}
  }

  // Inject the stylesheet synchronously (script is in <head>) to avoid a flash
  document.documentElement.setAttribute('data-skin', skin);
  document.write('<link rel="stylesheet" href="skins/' + skin + '.css">');

  function setSkin(id) {
    if (!validSkin(id) || id === skin) return;
    try { localStorage.setItem(KEY, id); } catch (e) {}
    // Reload with a clean URL so the new skin loads from scratch
    var url = new URL(window.location.href);
    url.searchParams.delete('skin');
    window.location.href = url.toString();
  }

  // ── Floating skin switcher ──
  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.createElement('div');
    wrap.className = 'skin-switcher';
    wrap.setAttribute('aria-label', 'Change site style');

    var toggle = document.createElement('button');
    toggle.className = 'skin-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Change site style');
    toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>';

    var menu = document.createElement('div');
    menu.className = 'skin-menu';
    SKINS.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'skin-option' + (s.id === skin ? ' is-active' : '');
      b.innerHTML = '<span class="skin-swatch skin-swatch-' + s.id + '"></span><span class="skin-name">' + s.label + '</span><span class="skin-hint">' + s.hint + '</span>';
      b.addEventListener('click', function () { setSkin(s.id); });
      menu.appendChild(b);
    });

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.skin-switcher')) wrap.classList.remove('open');
    });

    wrap.appendChild(menu);
    wrap.appendChild(toggle);
    document.body.appendChild(wrap);
  });
})();
