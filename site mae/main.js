document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MENU MOBILE (HAMBURGUER)
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
            
            // Animação do hamburguer
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('open')) {
                bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Fechar menu ao clicar em qualquer link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('open');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // ==========================================================================
    // 2. HEADER EFEITO SCROLL
    // ==========================================================================
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Atualizar link ativo na navegação
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 120;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // 3. REVEAL ON SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Revelar apenas uma vez
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // 4. INTERACTIVE ECOSYSTEM HUB (CARDS REDIRECIONANDO SUAVEMENTE)
    // ==========================================================================
    const divisionCards = document.querySelectorAll('.division-card');
    
    divisionCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // 5. INTERATIVIDADE DO FORMULÁRIO INTELIGENTE
    // ==========================================================================
    const contactForm = document.getElementById('group-contact-form');
    const sectorSelect = document.getElementById('form-sector');
    const actionButtons = document.querySelectorAll('[data-division]');

    // Mudar a estética do formulário conforme a divisão selecionada
    if (sectorSelect && contactForm) {
        sectorSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            // Remover classes de foco anteriores
            contactForm.classList.remove('focus-consulting', 'focus-logistics');
            
            // Adicionar classe correspondente
            if (value === 'consultoria') {
                contactForm.classList.add('focus-consulting');
            } else if (value === 'logistica') {
                contactForm.classList.add('focus-logistics');
            }
        });
    }

    // Ações dos botões "Agendar/Orçar" que levam ao formulário com pré-seleção
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const division = btn.getAttribute('data-division');
            
            if (sectorSelect) {
                if (division === 'consulting') {
                    sectorSelect.value = 'consultoria';
                } else if (division === 'logistics') {
                    sectorSelect.value = 'logistica';
                } else if (division === 'furniture') {
                    sectorSelect.value = 'moveis';
                }
                
                // Disparar evento de mudança para aplicar o estilo
                sectorSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    // Envio do formulário
    if (contactForm) {
        const feedbackEl = document.getElementById('form-feedback');
        const submitBtn = document.getElementById('btn-submit');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Estado de envio
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const phone = document.getElementById('form-phone').value;
            const sector = sectorSelect.value;
            const message = document.getElementById('form-message').value;

            // Simular chamada de API com timeout
            setTimeout(() => {
                submitBtn.textContent = 'Enviar Mensagem';
                submitBtn.disabled = false;

                // Sucesso
                feedbackEl.classList.remove('hidden', 'error');
                feedbackEl.classList.add('success');
                
                let sectorName = '';
                if (sector === 'consultoria') sectorName = 'Chear Consultoria';
                else if (sector === 'logistica') sectorName = 'Chear Logística';
                else if (sector === 'moveis') sectorName = 'Chear Móveis Planejados';
                else sectorName = 'Chear Geral';

                feedbackEl.innerHTML = `<strong>Obrigado, ${name}!</strong> Sua mensagem foi direcionada com sucesso para o departamento <strong>${sectorName}</strong>. Entraremos em contato em breve.`;
                
                // Limpar campos
                contactForm.reset();
                contactForm.classList.remove('focus-consulting', 'focus-logistics');

                // Esconder feedback depois de 8 segundos
                setTimeout(() => {
                    feedbackEl.classList.add('hidden');
                }, 8000);

            }, 1500);
        });
    }
});
