// Bilingual toggle (PT default, EN via data-en), navigation, reveal-on-scroll, contact form.
(function () {
  'use strict';

  var KEY = 'site-lang';
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function detect() {
    var s = stored();
    if (s === 'pt' || s === 'en') return s;
    return (navigator.language || 'pt').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
  }

  // Elements flagged data-html carry trusted inline markup (e.g. <em>) in both languages.
  function setText(el, value) {
    if (el.hasAttribute('data-html')) el.innerHTML = value; else el.textContent = value;
  }
  function capturePT() {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-pt')) el.setAttribute('data-pt', el.hasAttribute('data-html') ? el.innerHTML : el.textContent);
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      if (!el.hasAttribute('data-pt-placeholder')) el.setAttribute('data-pt-placeholder', el.getAttribute('placeholder') || '');
    });
  }
  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      setText(el, el.getAttribute(lang === 'en' ? 'data-en' : 'data-pt'));
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute(lang === 'en' ? 'data-en-placeholder' : 'data-pt-placeholder'));
    });
    document.querySelectorAll('img[data-en-src]').forEach(function (el) {
      el.setAttribute('src', el.getAttribute(lang === 'en' ? 'data-en-src' : 'data-pt-src'));
    });
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
    var t = document.getElementById('lang-toggle');
    if (t) t.textContent = lang === 'pt' ? 'EN' : 'PT';
    store(lang);
    window.__lang = lang;
  }

  function init() {
    capturePT();
    applyLang(detect());

    var t = document.getElementById('lang-toggle');
    if (t) t.addEventListener('click', function () { applyLang(window.__lang === 'pt' ? 'en' : 'pt'); });

    // Header shadow
    var header = document.getElementById('site-header');
    function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Mobile menu
    var mt = document.getElementById('menu-toggle'), nav = document.getElementById('main-nav');
    if (mt && nav) {
      mt.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        mt.classList.toggle('open', open);
        mt.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('open'); mt.classList.remove('open'); mt.setAttribute('aria-expanded', 'false'); });
      });
    }

    // Active link
    var path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.main-nav .nav-link').forEach(function (a) {
      var href = a.getAttribute('href').replace(/\/$/, '') || '/';
      var on = href === path || (href !== '/' && path.indexOf(href) === 0);
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
    });

    // Reveal on scroll
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    } else { items.forEach(function (el) { el.classList.add('in'); }); }

    // Services showcase: hover/focus/click swaps the image on the right
    var items = document.querySelectorAll('.sc-item'), imgs = document.querySelectorAll('.sc-img'), cap = document.getElementById('sc-caption');
    if (items.length && imgs.length) {
      var caps = [
        ['Rede de drenagem derivada de dados de terreno (bacia do Rovubué)', 'River network derived from terrain data (Rovubue basin)'],
        ['N1: 89 travessias sobre a rede de drenagem', 'N1: 89 crossings over the drainage network'],
        ['Secção hidrogeológica esquemática: furo, rebaixamento e piezómetros', 'Schematic hydrogeological section: borehole, drawdown and piezometers'],
        ['Confluência e planície de inundação a partir do relevo', 'Confluence and floodplain from terrain relief']
      ];
      function pick(i) {
        items.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-idx') === String(i)); });
        imgs.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-idx') === String(i)); });
        if (cap) { cap.setAttribute('data-pt', caps[i][0]); cap.setAttribute('data-en', caps[i][1]); cap.textContent = caps[i][window.__lang === 'en' ? 1 : 0]; }
      }
      items.forEach(function (el) {
        var i = el.getAttribute('data-idx');
        el.addEventListener('mouseenter', function () { pick(i); });
        el.addEventListener('focus', function () { pick(i); });
      });
    }

    // Contact form → composes an e-mail (and optional WhatsApp message); nothing is sent silently.
    var form = document.getElementById('contact-form');
    if (form) {
      var cfg = window.SITE || {};
      function compose() {
        var f = new FormData(form), en = window.__lang === 'en';
        var lines = [
          (en ? 'Name: ' : 'Nome: ') + (f.get('nome') || ''),
          (en ? 'Organisation: ' : 'Organização: ') + (f.get('org') || ''),
          (en ? 'Area: ' : 'Área: ') + (f.get('area') || ''),
          '', f.get('msg') || ''
        ];
        return { subject: (en ? 'Enquiry via website — ' : 'Pedido via website — ') + (f.get('area') || ''), body: lines.join('\n'), reply: f.get('email') || '' };
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var c = compose();
        var body = c.body + (c.reply ? '\n\n' + (window.__lang === 'en' ? 'Reply to: ' : 'Responder para: ') + c.reply : '');
        location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(c.subject) + '&body=' + encodeURIComponent(body);
        var m = document.getElementById('form-message');
        if (m) m.textContent = window.__lang === 'en' ? 'Your e-mail app should open with the message ready to send.' : 'A aplicação de e-mail deve abrir com a mensagem pronta a enviar.';
      });
      var wa = document.getElementById('wa-btn');
      if (wa) {
        if (!cfg.whatsapp) { wa.hidden = true; }
        else wa.addEventListener('click', function () {
          var c = compose();
          window.open('https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(c.subject + '\n\n' + c.body), '_blank', 'noopener');
        });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
