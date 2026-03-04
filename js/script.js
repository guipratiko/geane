(function () {
  'use strict';

  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    function closeMenu() {
      nav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  var form = document.querySelector('.form-inscricao');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Inscrição recebida! Em breve entraremos em contato.');
    });
  }

  /* Header: destaque ao rolar (melhor sensação de profundidade) */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Sticky CTA: exibir após passar o hero (conversão mobile) */
  var stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    var hero = document.getElementById('hero');
    var observerSticky = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stickyCta.classList.remove('is-visible');
            stickyCta.setAttribute('aria-hidden', 'true');
          } else {
            stickyCta.classList.add('is-visible');
            stickyCta.setAttribute('aria-hidden', 'false');
          }
        });
      },
      { rootMargin: '-20% 0px 0px 0px', threshold: 0 }
    );
    if (hero) observerSticky.observe(hero);
  }

  /* Scroll reveal: elementos entram ao entrar na viewport */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    var cards = document.querySelectorAll('.modulo-card[data-reveal]');
    cards.forEach(function (el, i) {
      el.style.setProperty('--i', i);
    });

    var observerReveal = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '-8% 0px -8% 0px', threshold: 0 }
    );

    revealEls.forEach(function (el) {
      observerReveal.observe(el);
    });
  }
})();
