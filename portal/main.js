/* ============================================================
   SHARE INVESTMENT — Portal Corporativo
   Interações: menu, header, reveal, contadores, navegação activa
   ============================================================ */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Header: fundo sólido ao rolar ---------- */
    var header = document.getElementById('main-header');

    function onScrollHeader() {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Menu mobile ---------- */
    var menuToggle = document.getElementById('menu-toggle');
    var navMenu = document.getElementById('nav-menu');

    function closeMenu() {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    /* ---------- Revelação ao rolar (com stagger por secção) ---------- */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !reducedMotion) {
        // Atraso incremental entre elementos irmãos da mesma secção
        var sections = document.querySelectorAll('section, footer');
        sections.forEach(function (section) {
            section.querySelectorAll('.reveal').forEach(function (el, i) {
                el.style.setProperty('--reveal-delay', Math.min(i * 90, 450) + 'ms');
            });
        });

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Contadores animados (estatísticas) ---------- */
    function formatCount(value, pad) {
        var text = String(value);
        while (pad && text.length < pad) text = '0' + text;
        return text;
    }

    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var pad = parseInt(el.getAttribute('data-pad') || '0', 10);
        if (reducedMotion) {
            el.textContent = formatCount(target, pad);
            return;
        }
        var duration = 1600;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
            el.textContent = formatCount(Math.round(target * eased), pad);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var statsGrid = document.getElementById('stats-grid');
    if (statsGrid && 'IntersectionObserver' in window) {
        var statsObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                statsGrid.querySelectorAll('.count').forEach(animateCount);
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsGrid);
    } else if (statsGrid) {
        statsGrid.querySelectorAll('.count').forEach(animateCount);
    }

    /* ---------- Link ativo na navegação ---------- */
    var navLinks = document.querySelectorAll('.nav-link');
    var trackedSections = [];

    navLinks.forEach(function (link) {
        var id = link.getAttribute('href');
        if (id && id.charAt(0) === '#') {
            var section = document.querySelector(id);
            if (section) trackedSections.push({ el: section, link: link });
        }
    });

    if ('IntersectionObserver' in window && trackedSections.length) {
        var activeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    trackedSections.forEach(function (t) {
                        if (t.el === entry.target) t.link.classList.add('active');
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        trackedSections.forEach(function (t) { activeObserver.observe(t.el); });
    }

})();
