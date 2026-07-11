/* ============================================================
   SHARE INVESTMENT — Portal Corporativo
   Interações: menu, header, reveal, contadores, rede do hero
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

    /* ---------- Rede de conexões no hero (canvas) ---------- */
    var canvas = document.getElementById('hero-network');
    if (canvas && !reducedMotion) {
        var ctx = canvas.getContext('2d');
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var nodes = [];
        var animationId = null;
        var running = false;
        var CONNECT_DIST = 150;

        function sizeCanvas() {
            var rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return rect;
        }

        function buildNodes() {
            var rect = sizeCanvas();
            var count = Math.max(24, Math.min(70, Math.floor((rect.width * rect.height) / 22000)));
            nodes = [];
            for (var i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    r: Math.random() * 1.4 + 0.6
                });
            }
        }

        function draw() {
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);

            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
                if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 164, 93, 0.55)';
                ctx.fill();
            }

            for (var a = 0; a < nodes.length; a++) {
                for (var b = a + 1; b < nodes.length; b++) {
                    var dx = nodes[a].x - nodes[b].x;
                    var dy = nodes[a].y - nodes[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[a].x, nodes[a].y);
                        ctx.lineTo(nodes[b].x, nodes[b].y);
                        ctx.strokeStyle = 'rgba(200, 164, 93, ' + (0.14 * (1 - dist / CONNECT_DIST)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        }

        function startNetwork() {
            if (!running) {
                running = true;
                animationId = requestAnimationFrame(draw);
            }
        }

        function stopNetwork() {
            running = false;
            if (animationId) cancelAnimationFrame(animationId);
        }

        buildNodes();
        startNetwork();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildNodes, 200);
        });

        // Pausa quando a aba fica oculta ou o hero sai do ecrã
        document.addEventListener('visibilitychange', function () {
            document.hidden ? stopNetwork() : startNetwork();
        });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries[0].isIntersecting ? startNetwork() : stopNetwork();
            }, { threshold: 0 }).observe(canvas);
        }
    }
})();
