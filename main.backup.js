/* ==========================================================================
   CHEAR MÓVEIS PLANEJADOS - INTERACTIVE LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CONFIGURAÇÃO DE HEADER E NAVBAR --- */
    const header = document.querySelector('.main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mudar estilo do Header ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Atualizar link ativo com base no scroll
        updateActiveNavLink();
    });

    // Toggle Menu Mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Função para atualizar o link ativo no menu conforme rola a página
    function updateActiveNavLink() {
        let fromTop = window.scrollY + 120;
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    /* --- 2. HERO SPLIT-SCREEN 3D & MICRO-INTERAÇÕES --- */

    // A. Efeito Parallax de Lente do Mouse no Vídeo de Fundo
    const heroFullscreen = document.querySelector('.hero-fullscreen');
    const heroBgVideo = document.querySelector('.hero-video-bg video');
    if (heroFullscreen && heroBgVideo) {
        heroFullscreen.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;
            
            // Desloca o vídeo levemente na direção oposta ao mouse
            const moveX = (mouseX / width) * -15;
            const moveY = (mouseY / height) * -15;
            
            heroBgVideo.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        });
        
        heroFullscreen.addEventListener('mouseleave', () => {
            heroBgVideo.style.transform = `scale(1.05) translate(0, 0)`;
        });
    }

    // A2. Efeito Parallax de Lente do Mouse no Vídeo de Fundo da Seção 2
    const aboutSection = document.querySelector('.about-section');
    const aboutBgVideo = document.querySelector('.about-video-bg video');
    if (aboutSection && aboutBgVideo) {
        aboutSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;
            
            // Desloca o vídeo levemente na direção oposta ao mouse
            const moveX = (mouseX / width) * -15;
            const moveY = (mouseY / height) * -15;
            
            aboutBgVideo.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        });
        
        aboutSection.addEventListener('mouseleave', () => {
            aboutBgVideo.style.transform = `scale(1.05) translate(0, 0)`;
        });
    }

    // A3. Efeito Parallax de Lente do Mouse no Vídeo de Fundo da Seção 4 (Simulador)
    const simulatorSection = document.querySelector('.simulator-section');
    const simulatorBgVideo = document.querySelector('.simulator-video-bg video');
    if (simulatorSection && simulatorBgVideo) {
        simulatorSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;
            
            // Desloca o vídeo levemente na direção oposta ao mouse
            const moveX = (mouseX / width) * -15;
            const moveY = (mouseY / height) * -15;
            
            simulatorBgVideo.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        });
        
        simulatorSection.addEventListener('mouseleave', () => {
            simulatorBgVideo.style.transform = `scale(1.05) translate(0, 0)`;
        });
    }

    // A4. Efeito Parallax de Lente do Mouse no Vídeo de Fundo da Seção 5 (Processo)
    const processSection = document.querySelector('.process-section');
    const processBgVideo = document.querySelector('.process-video-bg video, .process-video-bg img');
    if (processSection && processBgVideo) {
        processSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;
            
            // Desloca o vídeo levemente na direção oposta ao mouse
            const moveX = (mouseX / width) * -15;
            const moveY = (mouseY / height) * -15;
            
            processBgVideo.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        });
        
        processSection.addEventListener('mouseleave', () => {
            processBgVideo.style.transform = `scale(1.05) translate(0, 0)`;
        });
    }

    // B. Cursor Customizado de Luxo com Física (Lerp)
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const cursorSpeed = 0.14; // Taxa de suavização

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.opacity = '0';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * cursorSpeed;
        cursorY += (mouseY - cursorY) * cursorSpeed;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    // Apenas inicia animação do cursor se existir o elemento e não for tela de toque
    if (cursor && window.innerWidth > 576) {
        animateCursor();
        
        // Adicionar estado hover nos elementos interativos
        const updateHoverTriggers = () => {
            const hoverables = document.querySelectorAll('a, button, .arrow-btn, .option-btn, input, textarea, select, .simulator-panel, .slide-item:nth-child(n+3)');
            hoverables.forEach(el => {
                // Evita duplicar listeners
                el.removeEventListener('mouseenter', addCursorHover);
                el.removeEventListener('mouseleave', removeCursorHover);
                
                el.addEventListener('mouseenter', addCursorHover);
                el.addEventListener('mouseleave', removeCursorHover);
            });
        };
        
        function addCursorHover() {
            cursor.classList.add('hover');
        }
        
        function removeCursorHover() {
            cursor.classList.remove('hover');
        }
        
        updateHoverTriggers();
        
        // Observa mudanças no DOM para atualizar novos botões criados dinamicamente (como no slider)
        const observer = new MutationObserver(updateHoverTriggers);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* --- 3. REVELAÇÃO DE ELEMENTOS AO ROLAR A PÁGINA (SCROLL REVEAL) --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Uma vez animado, não precisamos observar novamente
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Dispara ligeiramente antes de entrar totalmente na tela
    });

    revealElements.forEach((el, index) => {
        // Atrasar ligeiramente elementos sequenciais no Hero
        if (el.classList.contains('scroll-reveal')) {
            el.style.transitionDelay = `${index * 0.15}s`;
            el.classList.add('active'); // O hero revela imediatamente
        } else {
            revealObserver.observe(el);
        }
    });


    /* --- 4. CARROSSEL DE PROJETOS CINEMATOGRÁFICO --- */
    const slider = document.getElementById('portfolio-slider');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    const indexDisplay = document.getElementById('slider-index');
    const progressHighlight = document.getElementById('slider-progress-highlight');

    const totalSlides = 14;
    let activeIndex = 0; // O Slide 1 (Cozinha) começa ativo (índice 0)

    if (slider && nextBtn && prevBtn) {
        // Inicializar controles no carregamento
        updateSliderControls();

        nextBtn.addEventListener('click', () => {
            const items = slider.querySelectorAll('.slide-item');
            slider.appendChild(items[0]); // Move o primeiro item (de trás) para o fim

            activeIndex = (activeIndex + 1) % totalSlides;
            updateSliderControls();
        });

        prevBtn.addEventListener('click', () => {
            const items = slider.querySelectorAll('.slide-item');
            slider.prepend(items[items.length - 1]); // Move o último item (da direita) para o início

            activeIndex = (activeIndex - 1 + totalSlides) % totalSlides;
            updateSliderControls();
        });

        // Suporte a gestos touch (deslizar com o dedo no celular)
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                nextBtn.click(); // Deslizar para a esquerda -> Avança
            } else if (touchEndX - touchStartX > threshold) {
                prevBtn.click(); // Deslizar para a direita -> Recua
            }
        }, { passive: true });
    }

    function updateSliderControls() {
        if (indexDisplay) {
            indexDisplay.textContent = `0${activeIndex + 1}`;
        }

        if (progressHighlight) {
            const stepWidth = 100 / totalSlides;
            progressHighlight.style.width = `${stepWidth}%`;
            progressHighlight.style.left = `${activeIndex * stepWidth}%`;
        }
    }


    /* --- 5. LOGICA DO SIMULADOR DE ACABAMENTOS (INTERATIVO) --- */
    const optionButtons = document.querySelectorAll('.option-btn');
    const simLuxGradeText = document.getElementById('sim-lux-grade');
    const btnUseSimConfig = document.getElementById('btn-use-sim-config');
    const savedConfigInput = document.getElementById('saved-sim-config');

    // Abas do simulador
    const tabButtons = document.querySelectorAll('.sim-tab-btn');
    const svgKitchen = document.getElementById('kitchen-svg');
    const svgBedroom = document.getElementById('bedroom-svg');
    const svgOffice = document.getElementById('office-svg');

    let activeEnv = 'kitchen'; // kitchen, bedroom, office

    // Estado da simulação por ambiente
    const simState = {
        kitchen: {
            cabinets: 'oak',      // oak, walnut, black
            countertop: 'calacatta', // calacatta, nero, quartz
            handles: 'gold'       // gold, black
        },
        bedroom: {
            cabinets: 'oak',      // oak, walnut, black
            headboard: 'obsidian', // obsidian, emerald, nordic
            handles: 'gold'       // gold, black
        },
        office: {
            cabinets: 'oak',      // oak, walnut, black
            countertop: 'calacatta', // calacatta, nero, quartz
            handles: 'gold'       // gold, black
        }
    };

    // Texturas mapeadas para fills do SVG
    const fillPatterns = {
        cabinets: {
            oak: 'url(#wood-oak)',
            walnut: 'url(#wood-walnut)',
            black: 'url(#matte-black)'
        },
        countertop: {
            calacatta: 'url(#marble-calacatta)',
            nero: 'url(#marble-nero)',
            quartz: 'url(#quartz-gold)'
        },
        handles: {
            gold: 'url(#gold-brushed)',
            black: 'url(#black-brushed)'
        }
    };

    // Nomes legíveis dos materiais para exibir
    const materialNames = {
        cabinets: { oak: 'Carvalho Natural', walnut: 'Nogueira Escura', black: 'Laca Preta Fosca' },
        countertop: { calacatta: 'Mármore Calacatta', nero: 'Nero Marquina', quartz: 'Quartzo Gold' },
        handles: { gold: 'Ouro Escovado', black: 'Preto Fosco' }
    };

    const environmentNames = {
        kitchen: 'Cozinha Gourmet',
        bedroom: 'Dormitório Casal',
        office: 'Home Office'
    };

    // Gerenciamento de Troca de Abas (Ambientes)
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const env = btn.getAttribute('data-env');
            activeEnv = env;
            
            // Ativar aba
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Ocultar todos os SVGs
            if (svgKitchen) svgKitchen.style.display = 'none';
            if (svgBedroom) svgBedroom.style.display = 'none';
            if (svgOffice) svgOffice.style.display = 'none';
            
            // Mostrar SVG correspondente
            if (env === 'kitchen' && svgKitchen) svgKitchen.style.display = 'block';
            if (env === 'bedroom' && svgBedroom) svgBedroom.style.display = 'block';
            if (env === 'office' && svgOffice) svgOffice.style.display = 'block';

            // Alternar grupos de controle na interface lateral
            document.querySelectorAll('.env-controls-group').forEach(group => {
                group.style.display = 'none';
            });
            const activeControls = document.getElementById(`controls-${env}`);
            if (activeControls) activeControls.style.display = 'block';

            // Atualizar o visual do SVG correspondente com o estado guardado
            Object.keys(simState[env]).forEach(target => {
                updateSVGVisuals(env, target, simState[env][target]);
            });

            // Atualizar o cálculo e descrição da linha
            updateSimSummary();
        });
    });

    // Delegamos a escuta do clique para os botões dinâmicos
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn) return;
        
        // Verificar se faz parte dos painéis do simulador
        const parentGroup = btn.parentElement;
        if (!parentGroup || !parentGroup.classList.contains('option-grid')) return;
        
        const target = parentGroup.getAttribute('data-target'); // cabinets, countertop, handles, headboard
        const value = btn.getAttribute('data-value');

        // Atualizar botões ativos no grupo correspondente
        parentGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Atualizar estado para o ambiente ativo
        simState[activeEnv][target] = value;

        // Atualizar o visual do SVG correspondente
        updateSVGVisuals(activeEnv, target, value);
        
        // Atualizar resumo e cálculo da linha luxo
        updateSimSummary();
    });

    function updateSVGVisuals(env, target, value) {
        if (target === 'headboard') {
            const head = document.getElementById('bedroom-headboard');
            const blanket = document.getElementById('bedroom-blanket');
            if (value === 'obsidian') {
                if (head) head.setAttribute('fill', '#181818');
                if (blanket) blanket.setAttribute('fill', 'url(#gold-brushed)');
            } else if (value === 'emerald') {
                if (head) head.setAttribute('fill', '#cfb095');
                if (blanket) blanket.setAttribute('fill', '#2d5a27');
            } else if (value === 'nordic') {
                if (head) head.setAttribute('fill', '#505052');
                if (blanket) blanket.setAttribute('fill', '#ffffff');
            }
            return;
        }

        const fill = fillPatterns[target][value];

        if (env === 'kitchen') {
            if (target === 'cabinets') {
                const top = document.getElementById('cabinets-top');
                const bottom = document.getElementById('cabinets-bottom');
                if (top) {
                    top.setAttribute('fill', fill);
                    top.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
                if (bottom) {
                    bottom.setAttribute('fill', fill);
                    bottom.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
            } else if (target === 'countertop') {
                const counter = document.querySelector('#countertop rect');
                if (counter) counter.setAttribute('fill', fill);
            } else if (target === 'handles') {
                const hand = document.getElementById('handles');
                if (hand) {
                    hand.setAttribute('fill', fill);
                    hand.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
            }
        } else if (env === 'bedroom') {
            if (target === 'cabinets') {
                const bedCabs = document.getElementById('bedroom-cabinets');
                const nightstand = document.getElementById('bedroom-nightstand');
                const nightstandDrawer = document.getElementById('bedroom-nightstand-drawer');
                if (bedCabs) {
                    bedCabs.setAttribute('fill', fill);
                    bedCabs.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
                if (nightstand) nightstand.setAttribute('fill', fill);
                if (nightstandDrawer) nightstandDrawer.setAttribute('fill', fill);
            } else if (target === 'handles') {
                const bedHands = document.getElementById('bedroom-handles');
                const nightstandHand = document.getElementById('bedroom-nightstand-handle');
                if (bedHands) {
                    bedHands.setAttribute('fill', fill);
                    bedHands.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
                if (nightstandHand) nightstandHand.setAttribute('fill', fill);
            }
        } else if (env === 'office') {
            if (target === 'cabinets') {
                const offCabs = document.getElementById('office-cabinets');
                const offShelves = document.getElementById('office-shelves');
                if (offCabs) {
                    offCabs.setAttribute('fill', fill);
                    offCabs.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
                if (offShelves) {
                    offShelves.setAttribute('fill', fill);
                    offShelves.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
            } else if (target === 'countertop') {
                const offCounterGroup = document.getElementById('office-countertop');
                if (offCounterGroup) {
                    offCounterGroup.setAttribute('fill', fill);
                    offCounterGroup.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
            } else if (target === 'handles') {
                const offHands = document.getElementById('office-handles');
                const offLeg = document.getElementById('office-leg');
                if (offHands) {
                    offHands.setAttribute('fill', fill);
                    offHands.querySelectorAll('rect').forEach(r => r.setAttribute('fill', fill));
                }
                if (offLeg) offLeg.setAttribute('fill', fill);
            }
        }
    }

    function updateSimSummary() {
        const state = simState[activeEnv];
        let lineTitle = "Linha Custom Luxe";
        let lineDesc = "";

        if (activeEnv === 'kitchen') {
            if (state.cabinets === 'black' && state.countertop === 'nero' && state.handles === 'gold') {
                lineTitle = "Cozinha Obsidian Gold (Exclusivo)";
            } else if (state.cabinets === 'oak' && state.countertop === 'calacatta' && state.handles === 'gold') {
                lineTitle = "Cozinha Nordic Elegance Premium";
            } else {
                lineTitle = "Cozinha Custom Premium";
            }
            lineDesc = `Especificação: Marcenaria em ${materialNames.cabinets[state.cabinets]}, tampo de pedra em ${materialNames.countertop[state.countertop]} e puxadores em ${materialNames.handles[state.handles]}.`;
        } else if (activeEnv === 'bedroom') {
            const textileNames = { obsidian: 'Obsidian Gold (Cabeceira preta & Manta Dourada)', emerald: 'Emerald Sand (Cabeceira Sand & Manta Esmeralda)', nordic: 'Nordic White (Cabeceira Cinza & Manta Branca)' };
            if (state.cabinets === 'black' && state.headboard === 'obsidian' && state.handles === 'gold') {
                lineTitle = "Dormitório Obsidian Gold (Exclusivo)";
            } else if (state.headboard === 'emerald') {
                lineTitle = "Dormitório Emerald Sand Luxury";
            } else {
                lineTitle = "Dormitório Custom Premium";
            }
            lineDesc = `Especificação: Guarda-roupa em ${materialNames.cabinets[state.cabinets]}, enxoval no padrão ${textileNames[state.headboard]} e ferragens em ${materialNames.handles[state.handles]}.`;
        } else if (activeEnv === 'office') {
            if (state.cabinets === 'black' && state.countertop === 'nero' && state.handles === 'black') {
                lineTitle = "Home Office Noir Minimalist";
            } else {
                lineTitle = "Home Office Custom Premium";
            }
            lineDesc = `Especificação: Escrivaninha/Prateleiras em ${materialNames.cabinets[state.cabinets]}, tampo de trabalho em ${materialNames.countertop[state.countertop]} e ferragens/estrutura em ${materialNames.handles[state.handles]}.`;
        }

        if (simLuxGradeText) {
            simLuxGradeText.textContent = lineTitle;
        }

        const summaryDescText = document.querySelector('.summary-desc');
        if (summaryDescText) {
            summaryDescText.textContent = lineDesc;
        }
    }

    // Inicialização do estado visual do simulador
    function initSimulator() {
        Object.keys(simState).forEach(env => {
            Object.keys(simState[env]).forEach(target => {
                updateSVGVisuals(env, target, simState[env][target]);
            });
        });
        updateSimSummary();
    }
    initSimulator();

    // Salvar configuração do simulador no formulário
    btnUseSimConfig.addEventListener('click', () => {
        const activeTab = document.querySelector('.sim-tab-btn.active');
        const envKey = activeTab ? activeTab.getAttribute('data-env') : 'kitchen';
        const envName = environmentNames[envKey];
        const state = simState[envKey];

        let textConfig = "";
        if (envKey === 'kitchen') {
            textConfig = `${envName} - ${simLuxGradeText.textContent} (Marcenaria: ${materialNames.cabinets[state.cabinets]}, Tampo: ${materialNames.countertop[state.countertop]}, Puxadores: ${materialNames.handles[state.handles]})`;
        } else if (envKey === 'bedroom') {
            const textileNames = { obsidian: 'Obsidian Gold', emerald: 'Emerald Sand', nordic: 'Nordic White' };
            textConfig = `${envName} - ${simLuxGradeText.textContent} (Móveis: ${materialNames.cabinets[state.cabinets]}, Cabeceira: ${textileNames[state.headboard]}, Puxadores: ${materialNames.handles[state.handles]})`;
        } else if (envKey === 'office') {
            textConfig = `${envName} - ${simLuxGradeText.textContent} (Estrutura: ${materialNames.cabinets[state.cabinets]}, Tampo: ${materialNames.countertop[state.countertop]}, Ferragens: ${materialNames.handles[state.handles]})`;
        }
        
        savedConfigInput.value = textConfig;
        
        // Efeito visual no input indicando sucesso
        savedConfigInput.classList.add('active-saved');
        setTimeout(() => {
            savedConfigInput.classList.remove('active-saved');
        }, 1500);

        // Rolar suavemente até a seção de contato/orçamento
        const contactSection = document.getElementById('contato');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });


    /* --- 6. FORMULÁRIO MULTIETAPAS & INTEGRAÇÃO WHATSAPP --- */
    const form = document.getElementById('multistep-form');
    const stepContents = document.querySelectorAll('.form-step-content');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    
    let currentStep = 1;

    // Navegar para frente
    btnNextSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                goToStep(currentStep);
            }
        });
    });

    // Navegar para trás
    btnPrevSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            goToStep(currentStep);
        });
    });

    function goToStep(step) {
        // Esconder todos os passos e remover indicador ativo
        stepContents.forEach(content => content.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));

        // Ativar o passo atual
        const activeContent = document.querySelector(`.form-step-content[data-step="${step}"]`);
        activeContent.classList.add('active');

        // Ativar indicadores até o passo atual
        stepIndicators.forEach(indicator => {
            const indStep = parseInt(indicator.getAttribute('data-step'));
            if (indStep <= step) {
                indicator.classList.add('active');
            }
        });
    }

    function validateStep(step) {
        if (step === 1) {
            // Verificar se pelo menos um ambiente foi selecionado
            const checkboxes = form.querySelectorAll('input[name="ambientes"]:checked');
            if (checkboxes.length === 0) {
                alert('Por favor, selecione pelo menos um ambiente para prosseguir.');
                return false;
            }
        } else if (step === 2) {
            // Verificar se a metragem foi preenchida
            const metragemInput = document.getElementById('metragem');
            if (!metragemInput.value || parseFloat(metragemInput.value) <= 0) {
                alert('Por favor, informe uma metragem aproximada para continuarmos.');
                metragemInput.focus();
                return false;
            }
        }
        return true;
    }

    // Processamento do Envio do Formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar etapa 3
        const nome = document.getElementById('nome').value.trim();
        const whatsappClient = document.getElementById('whatsapp').value.trim();
        const mensagemAdicional = document.getElementById('mensagem').value.trim();
        
        if (!nome || !whatsappClient) {
            alert('Por favor, preencha seu nome e contacto.');
            return;
        }

        // Reunir ambientes selecionados
        const ambientesSelecionados = [];
        form.querySelectorAll('input[name="ambientes"]:checked').forEach(cb => {
            ambientesSelecionados.push(cb.value);
        });

        // Informações adicionais
        const statusImovel = document.getElementById('imovel-status').value;
        const metragem = document.getElementById('metragem').value;
        const simConfig = savedConfigInput.value || "Não configurado no simulador";

        // Montar texto da mensagem para o WhatsApp de forma elegante e estruturada
        const textoMsg = `Olá Chear Móveis Planejados! Gostaria de planejar meu espaço. Aqui estão as informações iniciais:

*Cliente:* ${nome}
*Contacto:* ${whatsappClient}

*Ambiente(s):* ${ambientesSelecionados.join(', ')}
*Metragem Estimada:* ${metragem} m²
*Status do Imóvel:* ${statusImovel}

*Configuração de Acabamentos:* 
_${simConfig}_

*Detalhes do Projeto:*
${mensagemAdicional ? messageFilter(mensagemAdicional) : 'Sem observações adicionais.'}

Aguardo contato para darmos início ao projeto 3D!`;

        // URL encode do texto
        const encodedText = encodeURIComponent(textoMsg);
        
        // Números de contato da Chear (enviar para o principal: 939112954)
        const whatsappNumber = "244939112954";
        
        // Link final da API do WhatsApp
        const waLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

        // Abrir em nova aba
        window.open(waLink, '_blank');
    });

    // Limpar quebras de linha estranhas
    function messageFilter(text) {
        return text.replace(/\n/g, ' ');
    }

    // C. Efeito Click Ripple nas interações
    window.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .arrow-btn, .option-btn')) {
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });

    /* --- 7. ASSISTENTE DE CONVERSA INTERATIVO (CHAT POP-UP) --- */
    const chatWidget = document.getElementById('chat-assistant');
    const btnCloseChat = document.getElementById('btn-close-chat');

    if (chatWidget) {
        // Exibir o assistente de chat após um delay de 3 segundos
        setTimeout(() => {
            const chatClosed = sessionStorage.getItem('chatClosed');
            if (!chatClosed) {
                chatWidget.classList.add('active');
            }
        }, 3000);

        // Fechar o assistente de chat
        if (btnCloseChat) {
            btnCloseChat.addEventListener('click', () => {
                chatWidget.classList.remove('active');
                sessionStorage.setItem('chatClosed', 'true');
            });
        }

        // Respostas rápidas (ações dos botões)
        const quickReplies = chatWidget.querySelectorAll('.quick-reply-btn');
        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                
                if (action === 'simulate') {
                    // Rolar até a seção de Simulador
                    const simSection = document.getElementById('simulador');
                    if (simSection) {
                        simSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    chatWidget.classList.remove('active');
                } else if (action === 'whatsapp') {
                    // Direcionar para WhatsApp da Chear
                    const whatsappNumber = "244939112954";
                    const welcomeText = encodeURIComponent("Olá! Estou a navegar no site da CHEAR e gostaria de falar com um designer especialista para um orçamento.");
                    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${welcomeText}`, '_blank');
                    chatWidget.classList.remove('active');
                } else if (action === 'portfolio') {
                    // Rolar até a seção do Portfólio de Ambientes
                    const portfolioSection = document.getElementById('ambientes');
                    if (portfolioSection) {
                        portfolioSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    chatWidget.classList.remove('active');
                }
            });
        });

        // Abrir janela de conversa ao passar o mouse sobre o ícone flutuante do WhatsApp
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.addEventListener('mouseenter', () => {
                chatWidget.classList.add('active');
            });
        }
    }

    /* --- 8. MICRO-INTERAÇÃO AURA DOURADA NAS SEÇÕES ESCURAS --- */
    const glowSections = document.querySelectorAll('.glow-aura-section');
    glowSections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            section.style.setProperty('--mouse-x', `${x}px`);
            section.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
