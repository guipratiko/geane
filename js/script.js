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

  /* Scroll para o card de preço: centraliza o card e deixa o botão visível */
  var precoCard = document.getElementById('preco-card');
  if (precoCard) {
    document.querySelectorAll('a[href="#preco"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        precoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
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

  /* Modal lead */
  var leadModal = document.getElementById('lead-modal');
  var leadModalClose = document.getElementById('lead-modal-close');
  var leadModalForm = document.getElementById('lead-modal-form');
  var leadModalError = document.getElementById('lead-modal-error');
  var leadModalSubmit = document.getElementById('lead-modal-submit');
  var REDIRECT_CHECKOUT = 'https://pay.kiwify.com.br/iDL8Dfb';

  function openLeadModal() {
    if (!leadModal) return;
    leadModal.classList.add('is-open');
    leadModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lead-modal-open');
    if (leadModalError) leadModalError.textContent = '';
    leadModal.querySelector('.lead-modal-input') && leadModal.querySelector('.lead-modal-input').focus();
  }

  function closeLeadModal() {
    if (!leadModal) return;
    leadModal.classList.remove('is-open');
    leadModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lead-modal-open');
  }

  document.querySelectorAll('[data-open-lead-modal], #btn-garanta-vaga').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openLeadModal();
    });
  });

  if (leadModalClose) {
    leadModalClose.addEventListener('click', closeLeadModal);
  }

  if (leadModal) {
    leadModal.addEventListener('click', function (e) {
      if (e.target === leadModal) closeLeadModal();
    });
    leadModal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLeadModal();
    });
  }

  if (leadModalForm) {
    leadModalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nomeEl = document.getElementById('lead-nome');
      var whatsappEl = document.getElementById('lead-whatsapp');
      var nome = (nomeEl && nomeEl.value || '').trim();
      var whatsapp = (whatsappEl && whatsappEl.value || '').trim();

      if (leadModalError) leadModalError.textContent = '';
      if (!nome || !whatsapp) {
        if (leadModalError) leadModalError.textContent = 'Preencha nome e WhatsApp.';
        return;
      }

      if (leadModalSubmit) {
        leadModalSubmit.disabled = true;
        leadModalSubmit.textContent = 'Enviando…';
      }

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome, whatsapp: whatsapp }),
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data.ok && result.data.redirect) {
            if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
            closeLeadModal();
            window.location.href = result.data.redirect;
            return;
          }
          if (leadModalError) leadModalError.textContent = (result.data && result.data.message) || 'Não foi possível enviar. Tente novamente.';
          if (leadModalSubmit) {
            leadModalSubmit.disabled = false;
            leadModalSubmit.textContent = 'Continuar';
          }
        })
        .catch(function () {
          if (leadModalError) leadModalError.textContent = 'Erro de conexão. Tente novamente.';
          if (leadModalSubmit) {
            leadModalSubmit.disabled = false;
            leadModalSubmit.textContent = 'Continuar';
          }
        });
    });
  }

  var footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }
})();
