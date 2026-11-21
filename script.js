/**
 * SUDHARSHAN P S - Personal Portfolio Website
 * 3D Interactive Cyber-Codex Book Controller & Animation Engine
 * Version 3.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. PROCEDURAL WEB AUDIO API SYNTHESIZER
    // ==========================================
    let audioCtx = null;
    let audioEnabled = true;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playPageTurnSound() {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const bufferSize = ctx.sampleRate * 0.12;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
            filter.Q.value = 1.2;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        } catch (e) {
            // Audio fail silent fallback
        }
    }

    function playCyberBeep(freq = 880, duration = 0.08) {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    function playKeyClickSound() {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        } catch (e) {}
    }

    // Audio Toggle Button
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            if (audioEnabled) {
                audioIcon.className = 'bx bx-volume-full';
                audioLabel.textContent = 'Sound ON';
                audioToggleBtn.classList.remove('active-glow');
                playCyberBeep(640, 0.06);
            } else {
                audioIcon.className = 'bx bx-volume-mute';
                audioLabel.textContent = 'Muted';
                audioToggleBtn.classList.add('active-glow');
            }
        });
    }

    // ==========================================
    // 2. BACKGROUND CONSTELLATION PARTICLE CANVAS
    // ==========================================
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 16000), 70);
        let mouseX = -1000;
        let mouseY = -1000;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 1.8 + 0.8;
                this.alpha = Math.random() * 0.45 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - dist) / 100;
                    this.x -= Math.cos(angle) * force * 1.4;
                    this.y -= Math.sin(angle) * force * 1.4;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(36, 99, 235, ${this.alpha * 0.6})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(36, 99, 235, ${alpha * 0.35})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            if (mouseX > 0 && mouseY > 0) {
                for (let i = 0; i < particles.length; i++) {
                    const dx = mouseX - particles[i].x;
                    const dy = mouseY - particles[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(22, 139, 223, ${alpha * 0.55})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // ==========================================
    // 3. CUSTOM CURSOR & SPOTLIGHT EFFECT
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const spotlight = document.getElementById('spotlight');

    if (cursorDot && cursorRing) {
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            if (spotlight) {
                spotlight.style.left = `${mouseX}px`;
                spotlight.style.top = `${mouseY}px`;
            }
        });

        function animateCursorRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursorRing);
        }
        animateCursorRing();

        const interactiveEls = document.querySelectorAll('a, button, input, textarea, .card-tilt, .social-icon, .spread-pill');
        interactiveEls.forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ==========================================
    // 4. 3D CARD PERSPECTIVE TILT
    // ==========================================
    const tiltCards = document.querySelectorAll('.card-tilt');
    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ==========================================
    // 5. ANIMATED ROLE TYPING ENGINE
    // ==========================================
    const typingTextEl = document.getElementById('typingText');
    const roles = [
        'Software Developer',
        'Cybersecurity Specialist',
        'AI & Machine Learning Builder',
        'Full-Stack Developer',
        'Computer Vision & IoT Engineer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRoles() {
        if (!typingTextEl) return;
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 45;
        } else {
            typingTextEl.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 95;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 450;
        }

        setTimeout(typeRoles, typingSpeed);
    }
    typeRoles();

    // ==========================================
    // 6. 3D BOOK CONTROLLER & SPREAD NAVIGATION
    // ==========================================
    const pages = Array.from(document.querySelectorAll('.book-page.page-right'));
    const totalPages = pages.length; // 5 flippable right leaves
    let currentSpread = 0;

    const pageHero = document.getElementById('pageHero');

    function updatePageZIndexes() {
        pages.forEach((page, index) => {
            if (page.classList.contains('turn')) {
                // Turned pages stack sequentially over the left side (above pageHero z-index: 1)
                page.style.zIndex = 10 + index;
            } else {
                // Unturned pages stack sequentially over the right side
                page.style.zIndex = 10 + (totalPages - index);
            }
        });
    }
    updatePageZIndexes();

    function turnPageAtIndex(index, turnOver) {
        if (index < 0 || index >= totalPages) return;
        const page = pages[index];

        if (turnOver) {
            page.classList.add('turn');
            playPageTurnSound();
            page.style.zIndex = 30 + index;
            setTimeout(() => {
                page.style.zIndex = 10 + index;
            }, 600);
        } else {
            page.classList.remove('turn');
            playPageTurnSound();
            page.style.zIndex = 30 + (totalPages - index);
            setTimeout(() => {
                page.style.zIndex = 10 + (totalPages - index);
            }, 600);
        }

        setTimeout(() => {
            updatePageZIndexes();
        }, 700);
    }

    function goToSpread(targetSpread) {
        if (targetSpread < 0) targetSpread = 0;
        if (targetSpread > totalPages) targetSpread = totalPages;

        currentSpread = targetSpread;

        // Manage stationary left hero page visibility
        if (targetSpread === 0) {
            // Returning to Spread 0: reveal profile page immediately
            if (pageHero) pageHero.classList.remove('page-covered');
        } else {
            // Flipping forward: conceal stationary hero page to prevent profile image bleed-through
            setTimeout(() => {
                if (currentSpread > 0 && pageHero) {
                    pageHero.classList.add('page-covered');
                }
            }, 350);
        }

        pages.forEach((page, idx) => {
            const shouldBeTurned = idx < targetSpread;
            const isCurrentlyTurned = page.classList.contains('turn');

            if (shouldBeTurned !== isCurrentlyTurned) {
                setTimeout(() => {
                    turnPageAtIndex(idx, shouldBeTurned);
                }, Math.abs(idx - targetSpread) * 85);
            }
        });

        updateSpreadUI(targetSpread);
        syncMobilePage(targetSpread);
    }

    const CHAPTER_DATA = [
        { spread: 0, title: "Profile & About Me", pageChip: "Cover // 00-01" },
        { spread: 1, title: "Education & Experience", pageChip: "Pages 02-03" },
        { spread: 2, title: "Skills & Featured Projects", pageChip: "Pages 04-05" },
        { spread: 3, title: "Startups & Cyber Lab", pageChip: "Pages 06-07" },
        { spread: 4, title: "Awards & Contact Hub", pageChip: "Pages 08-09" },
        { spread: 5, title: "System Architecture", pageChip: "Page 10" }
    ];

    function updateSpreadUI(spreadIndex) {
        // Update Floating HUD indicator
        const hudPageNum = document.getElementById('hudPageNum');
        const hudChapterTitle = document.getElementById('hudChapterTitle');
        const hudPrevBtn = document.getElementById('hudPrevBtn');
        const hudNextBtn = document.getElementById('hudNextBtn');
        const bookSidePrev = document.getElementById('bookSidePrev');
        const bookSideNext = document.getElementById('bookSideNext');

        const ch = CHAPTER_DATA[spreadIndex] || { title: "Portfolio Codex", pageChip: `Spread ${spreadIndex}` };

        if (hudPageNum) hudPageNum.textContent = ch.pageChip;
        if (hudChapterTitle) hudChapterTitle.textContent = ch.title;

        if (hudPrevBtn) hudPrevBtn.disabled = (spreadIndex === 0);
        if (hudNextBtn) hudNextBtn.disabled = (spreadIndex >= totalPages);
        if (bookSidePrev) bookSidePrev.disabled = (spreadIndex === 0);
        if (bookSideNext) bookSideNext.disabled = (spreadIndex >= totalPages);

        // Update Table of Contents active states
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach((item) => {
            const sp = parseInt(item.getAttribute('data-spread'), 10);
            if (sp === spreadIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function syncMobilePage(spreadIndex) {
        if (window.innerWidth <= 768) {
            // First, isolate stationary hero page (Profile) to ONLY Spread 0
            if (pageHero) {
                if (spreadIndex === 0) {
                    pageHero.classList.add('mobile-active');
                } else {
                    pageHero.classList.remove('mobile-active');
                }
            }

            // Manage pages per spread
            pages.forEach((page, index) => {
                page.classList.remove('mobile-active', 'show-back');

                if (spreadIndex === 0) {
                    // Spread 0: Page 0 (Hero) + Page 1 (About - front of leaf 0)
                    if (index === 0) {
                        page.classList.add('mobile-active');
                    }
                } else if (spreadIndex === 1) {
                    // Spread 1: Page 2 (Education - back of leaf 0) + Page 3 (Skills - front of leaf 1)
                    if (index === 0) {
                        page.classList.add('mobile-active', 'show-back');
                    } else if (index === 1) {
                        page.classList.add('mobile-active');
                    }
                } else if (spreadIndex === 2) {
                    // Spread 2: Page 4 (Projects 1 - back of leaf 1) + Page 5 (Projects 2 - front of leaf 2)
                    if (index === 1) {
                        page.classList.add('mobile-active', 'show-back');
                    } else if (index === 2) {
                        page.classList.add('mobile-active');
                    }
                } else if (spreadIndex === 3) {
                    // Spread 3: Page 6 (Startups - back of leaf 2) + Page 7 (Cyber Lab - front of leaf 3)
                    if (index === 2) {
                        page.classList.add('mobile-active', 'show-back');
                    } else if (index === 3) {
                        page.classList.add('mobile-active');
                    }
                } else if (spreadIndex === 4) {
                    // Spread 4: Page 8 (Awards - back of leaf 3) + Page 9 (Contact - front of leaf 4)
                    if (index === 3) {
                        page.classList.add('mobile-active', 'show-back');
                    } else if (index === 4) {
                        page.classList.add('mobile-active');
                    }
                } else if (spreadIndex === 5) {
                    // Spread 5: Page 10 (Colophon - back of leaf 4)
                    if (index === 4) {
                        page.classList.add('mobile-active', 'show-back');
                    }
                }
            });
        }
    }

    window.addEventListener('resize', () => {
        syncMobilePage(currentSpread);
    });

    // Turn button event delegation inside book pages
    const turnButtons = document.querySelectorAll('.nextprev-btn');
    turnButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.hasAttribute('data-turn-page')) {
                const target = parseInt(btn.getAttribute('data-turn-page'), 10);
                goToSpread(target);
            } else if (btn.hasAttribute('data-turn-back')) {
                const target = parseInt(btn.getAttribute('data-turn-back'), 10) - 1;
                goToSpread(Math.max(0, target));
            }
        });
    });

    // Floating HUD Navigation
    const hudPrevBtn = document.getElementById('hudPrevBtn');
    if (hudPrevBtn) hudPrevBtn.addEventListener('click', () => {
        if (currentSpread > 0) goToSpread(currentSpread - 1);
    });

    const hudNextBtn = document.getElementById('hudNextBtn');
    if (hudNextBtn) hudNextBtn.addEventListener('click', () => {
        if (currentSpread < totalPages) goToSpread(currentSpread + 1);
    });

    const hudCoverBtn = document.getElementById('hudCoverBtn');
    if (hudCoverBtn) hudCoverBtn.addEventListener('click', () => goToSpread(0));

    const bookBrandBadge = document.getElementById('bookBrandBadge');
    if (bookBrandBadge) bookBrandBadge.addEventListener('click', () => goToSpread(0));

    // Side Navigation Chevrons
    const bookSidePrev = document.getElementById('bookSidePrev');
    if (bookSidePrev) bookSidePrev.addEventListener('click', () => {
        if (currentSpread > 0) goToSpread(currentSpread - 1);
    });

    const bookSideNext = document.getElementById('bookSideNext');
    if (bookSideNext) bookSideNext.addEventListener('click', () => {
        if (currentSpread < totalPages) goToSpread(currentSpread + 1);
    });

    // Table of Contents Modal Handling
    const hudTocBtn = document.getElementById('hudTocBtn');
    const hudPageIndicator = document.getElementById('hudPageIndicator');
    const tocOverlay = document.getElementById('tocOverlay');
    const tocCloseBtn = document.getElementById('tocCloseBtn');
    const tocItems = document.querySelectorAll('.toc-item');

    function openToc() {
        if (tocOverlay) {
            tocOverlay.classList.add('open');
            playCyberBeep(600, 0.04);
        }
    }
    function closeToc() {
        if (tocOverlay) tocOverlay.classList.remove('open');
    }

    if (hudTocBtn) hudTocBtn.addEventListener('click', openToc);
    if (hudPageIndicator) hudPageIndicator.addEventListener('click', openToc);
    if (tocCloseBtn) tocCloseBtn.addEventListener('click', closeToc);

    if (tocOverlay) {
        tocOverlay.addEventListener('click', (e) => {
            if (e.target === tocOverlay) closeToc();
        });
    }

    tocItems.forEach((item) => {
        item.addEventListener('click', () => {
            const targetSpread = parseInt(item.getAttribute('data-spread'), 10);
            closeToc();
            goToSpread(targetSpread);
        });
    });

    // Fullscreen API Toggle
    const dockFullscreenBtn = document.getElementById('dockFullscreenBtn');
    const dockFullscreenIcon = document.getElementById('dockFullscreenIcon');
    const dockFullscreenLabel = document.getElementById('dockFullscreenLabel');

    function toggleFullscreenMode() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn('Fullscreen request failed:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err) => {
                    console.warn('Exit fullscreen failed:', err);
                });
            }
        }
    }

    if (dockFullscreenBtn) {
        dockFullscreenBtn.addEventListener('click', toggleFullscreenMode);
    }

    document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        document.body.classList.toggle('is-fullscreen', isFs);
        if (dockFullscreenIcon) {
            dockFullscreenIcon.className = isFs ? 'bx bx-exit-fullscreen' : 'bx bx-fullscreen';
        }
        if (dockFullscreenLabel) {
            dockFullscreenLabel.textContent = isFs ? 'Exit' : 'Fullscreen';
        }
    });

    // Utility Dock Audio, Terminal, AI Buttons
    const dockSoundBtn = document.getElementById('dockSoundBtn');
    const dockSoundIcon = document.getElementById('dockSoundIcon');
    const dockSoundLabel = document.getElementById('dockSoundLabel');

    if (dockSoundBtn) {
        dockSoundBtn.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            if (dockSoundIcon) dockSoundIcon.className = audioEnabled ? 'bx bx-volume-full' : 'bx bx-volume-mute';
            if (dockSoundLabel) dockSoundLabel.textContent = audioEnabled ? 'Sound ON' : 'Muted';
            if (audioEnabled) {
                playCyberBeep(640, 0.06);
            }
        });
    }

    const dockTerminalBtn = document.getElementById('dockTerminalBtn');
    if (dockTerminalBtn) dockTerminalBtn.addEventListener('click', toggleTerminal);

    const dockAiBtn = document.getElementById('dockAiBtn');
    if (dockAiBtn) dockAiBtn.addEventListener('click', openAiAssistant);

    // Top navbar navigation items
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const targetSpread = parseInt(item.getAttribute('data-target-spread'), 10);
            goToSpread(targetSpread);
        });
    });

    // Mobile drawer navigation links
    const mobileLinks = document.querySelectorAll('.mobile-nav-drawer .mobile-nav-link[data-target-spread]');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const targetSpread = parseInt(link.getAttribute('data-target-spread'), 10);
            goToSpread(targetSpread);
            if (mobileDrawer) mobileDrawer.classList.remove('open');
        });
    });

    const mobileNavToggle = document.getElementById('mobileNavToggle');
    if (mobileNavToggle && mobileDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });
    }

    // Direct Action Links
    const navBrandBtn = document.getElementById('navBrandBtn');
    if (navBrandBtn) navBrandBtn.addEventListener('click', () => goToSpread(0));

    const heroProjectsBtn = document.getElementById('heroViewProjectsBtn');
    if (heroProjectsBtn) heroProjectsBtn.addEventListener('click', () => goToSpread(2));

    const heroContactBtn = document.getElementById('heroContactBtn');
    if (heroContactBtn) heroContactBtn.addEventListener('click', () => goToSpread(4));

    const backToStartBtn = document.getElementById('backToStartBtn');
    if (backToStartBtn) backToStartBtn.addEventListener('click', () => goToSpread(0));

    // Keyboard Arrow Keys Navigation
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            if (currentSpread < totalPages) goToSpread(currentSpread + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            if (currentSpread > 0) goToSpread(currentSpread - 1);
        } else if (e.key === 'Escape') {
            closeAllModals();
        } else if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Touch Swipe Navigation for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;
    const bookWrapper = document.getElementById('bookWrapper');

    if (bookWrapper) {
        bookWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        bookWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleTouchSwipe();
        }, { passive: true });
    }

    function handleTouchSwipe() {
        const threshold = 55;
        if (touchEndX < touchStartX - threshold) {
            if (currentSpread < totalPages) goToSpread(currentSpread + 1);
        } else if (touchEndX > touchStartX + threshold) {
            if (currentSpread > 0) goToSpread(currentSpread - 1);
        }
    }

    // ==========================================
    // 7. INTERACTIVE SKILL CONSTELLATION ENGINE
    // ==========================================
    const skillCanvas = document.getElementById('skillConstellationCanvas');
    if (skillCanvas) {
        const sCtx = skillCanvas.getContext('2d');
        let sWidth = (skillCanvas.width = skillCanvas.offsetWidth || 500);
        let sHeight = (skillCanvas.height = 180);

        window.addEventListener('resize', () => {
            if (skillCanvas.offsetWidth) {
                sWidth = skillCanvas.width = skillCanvas.offsetWidth;
                sHeight = skillCanvas.height = 180;
            }
        });

        const skillNodes = [
            { name: 'Python', cat: 'languages', x: 0.15, y: 0.35, r: 7, desc: 'Primary language for AI/ML, OpenCV automation, and security scripting across Hackademia and Threat Detection.' },
            { name: 'FastAPI', cat: 'fullstack', x: 0.32, y: 0.25, r: 6, desc: 'High-performance asynchronous REST microservices for real-time model scoring and CV frame analysis.' },
            { name: 'MediaPipe', cat: 'ai', x: 0.48, y: 0.20, r: 7, desc: 'Facial landmark mesh & hand gesture recognition powering Hackademia proctoring and the Gesture Robot Car.' },
            { name: 'OpenCV', cat: 'ai', x: 0.62, y: 0.32, r: 6.5, desc: 'Real-time computer vision frame decoding, gaze estimation, and spatial anomaly tracking.' },
            { name: 'React.js', cat: 'fullstack', x: 0.28, y: 0.65, r: 6.5, desc: 'Modern reactive component architecture for CredSense AI, Drishti 360, and SudharshanTech.' },
            { name: 'TypeScript', cat: 'languages', x: 0.44, y: 0.72, r: 6, desc: 'Strict type safety and enterprise system models used in CredSense AI and NidhiVizh.' },
            { name: 'Threat SAST', cat: 'cyber', x: 0.75, y: 0.55, r: 7, desc: 'Git secret exposure analysis, entropy scoring, and automated credential leakage prevention.' },
            { name: 'OWASP Top 10', cat: 'cyber', x: 0.86, y: 0.38, r: 6.5, desc: 'Defensive penetration auditing, prompt injection testing, and vulnerability mitigations.' },
            { name: 'Spring Boot', cat: 'fullstack', x: 0.55, y: 0.55, r: 6, desc: 'Enterprise Java architecture with Spring Security, stateless JWT RBAC, and relational data flows.' },
            { name: 'PostgreSQL', cat: 'devops', x: 0.70, y: 0.78, r: 5.5, desc: 'Relational ACID persistence for audit logs, user identities, and telemetry analytics.' },
            { name: 'Docker', cat: 'devops', x: 0.88, y: 0.70, r: 5.5, desc: 'Containerized deployment topologies ensuring reliable parity between local dev and cloud clusters.' }
        ];

        let activeCat = 'all';
        let hoveredNode = null;

        skillCanvas.addEventListener('mousemove', (e) => {
            const rect = skillCanvas.getBoundingClientRect();
            const mouseCanvasX = e.clientX - rect.left;
            const mouseCanvasY = e.clientY - rect.top;

            hoveredNode = null;
            for (let node of skillNodes) {
                if (activeCat !== 'all' && node.cat !== activeCat) continue;
                const nx = node.x * sWidth;
                const ny = node.y * sHeight;
                const d = Math.hypot(mouseCanvasX - nx, mouseCanvasY - ny);
                if (d < node.r + 6) {
                    hoveredNode = node;
                    updateSkillInspector(node);
                    break;
                }
            }
        });

        function updateSkillInspector(node) {
            const inspName = document.getElementById('inspSkillName');
            const inspCat = document.getElementById('inspSkillCat');
            const inspDesc = document.getElementById('inspSkillDetails');
            if (inspName) inspName.textContent = node.name;
            if (inspCat) inspCat.textContent = node.cat.toUpperCase();
            if (inspDesc) inspDesc.textContent = node.desc;
        }

        function drawSkillConstellation() {
            sCtx.clearRect(0, 0, sWidth, sHeight);

            // Draw connecting lines
            for (let i = 0; i < skillNodes.length; i++) {
                for (let j = i + 1; j < skillNodes.length; j++) {
                    const n1 = skillNodes[i];
                    const n2 = skillNodes[j];
                    if (activeCat !== 'all' && (n1.cat !== activeCat || n2.cat !== activeCat)) continue;

                    const x1 = n1.x * sWidth;
                    const y1 = n1.y * sHeight;
                    const x2 = n2.x * sWidth;
                    const y2 = n2.y * sHeight;
                    const dist = Math.hypot(x1 - x2, y1 - y2);

                    if (dist < 140) {
                        const alpha = (1 - dist / 140) * 0.35;
                        sCtx.beginPath();
                        sCtx.moveTo(x1, y1);
                        sCtx.lineTo(x2, y2);
                        sCtx.strokeStyle = (hoveredNode === n1 || hoveredNode === n2) ?
                            `rgba(36, 99, 235, 0.75)` : `rgba(140, 203, 255, ${alpha * 0.8})`;
                        sCtx.lineWidth = (hoveredNode === n1 || hoveredNode === n2) ? 1.5 : 0.8;
                        sCtx.stroke();
                    }
                }
            }

            // Draw nodes
            skillNodes.forEach((node) => {
                const isActive = (activeCat === 'all' || node.cat === activeCat);
                const nx = node.x * sWidth;
                const ny = node.y * sHeight;

                sCtx.beginPath();
                sCtx.arc(nx, ny, node.r, 0, Math.PI * 2);
                if (hoveredNode === node) {
                    sCtx.fillStyle = '#168bdf';
                    sCtx.shadowColor = 'rgba(36, 99, 235, 0.4)';
                    sCtx.shadowBlur = 12;
                } else if (isActive) {
                    sCtx.fillStyle = '#2463eb';
                    sCtx.shadowColor = 'rgba(36, 99, 235, 0.25)';
                    sCtx.shadowBlur = 6;
                } else {
                    sCtx.fillStyle = 'rgba(203, 213, 225, 0.45)';
                    sCtx.shadowBlur = 0;
                }
                sCtx.fill();
                sCtx.shadowBlur = 0;

                // Node label
                if (isActive) {
                    sCtx.fillStyle = (hoveredNode === node) ? '#164a9c' : '#142b4d';
                    sCtx.font = '600 9px Inter, sans-serif';
                    sCtx.textAlign = 'center';
                    sCtx.fillText(node.name, nx, ny + node.r + 11);
                }
            });

            requestAnimationFrame(drawSkillConstellation);
        }
        drawSkillConstellation();

        const catPills = document.querySelectorAll('.constellation-pill');
        catPills.forEach((pill) => {
            pill.addEventListener('click', () => {
                catPills.forEach((p) => p.classList.remove('active'));
                pill.classList.add('active');
                activeCat = pill.getAttribute('data-skill-cat');
                playCyberBeep(720, 0.04);
            });
        });
    }

    // ==========================================
    // 8. PROJECT INTELLIGENCE HUB & SEARCH ENGINE
    // ==========================================
    const searchInput = document.getElementById('projectSearchInput');
    const filterPills = document.querySelectorAll('.proj-filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activePill = document.querySelector('.proj-filter-pill.active');
        const filterVal = activePill ? activePill.getAttribute('data-filter') : 'all';

        projectCards.forEach((card) => {
            const cardCat = card.getAttribute('data-category') || '';
            const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const cardTitle = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
            const cardDesc = (card.querySelector('.project-description')?.textContent || '').toLowerCase();

            const matchesCategory = (filterVal === 'all') || cardCat.includes(filterVal);
            const matchesSearch = !query || cardKeywords.includes(query) || cardTitle.includes(query) || cardDesc.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInCard 0.35s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    filterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            filterPills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            playCyberBeep(680, 0.04);
            filterProjects();
        });
    });

    // ==========================================
    // 9. PROJECT CASE STUDY MODAL ENGINE
    // ==========================================
    const projectCaseStudies = {
        credsense: {
            title: 'CredSense AI — Git Secret Detection Platform',
            tagline: 'AI-Assisted Git Secret Detection & Exposure Risk Scoring',
            problem: 'Accidental leakage of API keys, database credentials, and private cryptographic certificates in Git histories causes massive enterprise exposure before security teams can react.',
            solution: 'CredSense AI performs high-throughput static scanning of git commits, integrates AI models to validate token viability, calculates real-time exposure timelines, and generates automated remediation patches.',
            security: 'Implements client-side entropy evaluation (Shannon entropy), zero-leak token masking in UI, auditable remediation timelines, and strict rate-limited scanning endpoints.',
            techStack: 'TypeScript, React, Node.js, Git Telemetry, Security SAST, AI Risk Scoring, Render Cloud',
            repoUrl: 'https://github.com/sudharshanps/CredSenseAI',
            demoUrl: 'https://credsense-ai.onrender.com/'
        },
        threat: {
            title: 'AI-Powered Cybersecurity Threat Detection Platform',
            tagline: 'Real-Time Phishing URL Defense & Suspicious Activity Monitoring',
            problem: 'Polymorphic phishing URLs and obfuscated attack vectors easily bypass traditional static blocklists and keyword-based email filters.',
            solution: 'Developed an ensemble machine learning classification pipeline with Scikit-learn that evaluates URL lexical structures, domain registration age, and host entropy. Deployed behind FastAPI for sub-50ms inference.',
            security: 'Enforces containerized microservice boundaries using Docker, parameter-sanitized PostgreSQL logging, and real-time threat alert webhooks.',
            techStack: 'Next.js, FastAPI, Scikit-learn, PostgreSQL, Docker, REST Microservices',
            repoUrl: 'https://github.com/sudharshanps/cyber-threat-detection',
            demoUrl: ''
        },
        drishti: {
            title: 'DRISHTI 360 — Farm-to-Market Agri Intelligence',
            tagline: 'AI Visual Crop Inspection & Digital Quality Passport',
            problem: 'Agricultural produce valuation suffers from subjective middleman grading, high spoilage, and zero verifiable provenance tracking across harvest batches.',
            solution: 'Employs computer vision to assess crop visual metrics (surface damage, uniformity, color index), assigns algorithmic market grades, and generates a tamper-evident QR Digital Quality Passport.',
            security: 'Cryptographically signed QR verification tokens ensure produce grade validity across transit without centralized tampering.',
            techStack: 'Computer Vision, FastAPI, React, Node.js, QR Verification, Grade-Linked Pricing Engine',
            repoUrl: 'https://github.com/sudharshanps/Drishti-360',
            demoUrl: ''
        },
        nidhivizh: {
            title: 'NidhiVizh (NIDHI SETU) — Financial Risk Investigation',
            tagline: 'Beyond Alerts. Into Evidence. Financial Risk & Compliance Bridge',
            problem: 'Compliance teams in banking are flooded with isolated transaction alerts, lacking an automated way to connect related entities into auditable evidence packets.',
            solution: 'Constructs dynamic graph topologies from transaction trails, applies entity clustering to uncover synthetic identities, and exports standardized regulatory audit packets.',
            security: 'Immutable audit logs, RBAC enforcement, and strict bank-grade data redaction standards.',
            techStack: 'TypeScript, React, Node.js, Graph Visuals, Financial Risk Analytics, Regulatory Audit Pipeline',
            repoUrl: 'https://github.com/sudharshanps/NidhiVizh',
            demoUrl: ''
        },
        hackademia: {
            title: 'Hackademia — AI Online Exam Invigilation System',
            tagline: 'National AI Hackathon Top 50 Finalist (out of 500+ teams)',
            problem: 'Remote examinations struggle with non-intrusive yet thorough proctoring to prevent multi-screen assistance, looking away, or multiple unauthorized persons.',
            solution: 'Engineered a real-time computer vision surveillance pipeline using MediaPipe FaceMesh with iris landmarks to estimate head pose, monitor gaze history, and flag multi-person presence.',
            security: 'Client-side frame decoding avoids unnecessary video stream storage, maintaining student biometric privacy while preserving auditable event logs.',
            techStack: 'Python, FastAPI, OpenCV, MediaPipe FaceMesh, Gaze Tracking, WebRTC',
            repoUrl: 'https://github.com/sudharshanps/hackademia-ai-invigilation',
            demoUrl: ''
        },
        taskguard: {
            title: 'TaskGuard — Enterprise Task Management System',
            tagline: 'Autonomous Task Safety & Developer Workflow Watchdog',
            problem: 'Large engineering organizations need structured task accountability with rigorous role-based permission boundaries and auditability.',
            solution: 'Enterprise Java Spring Boot platform implementing stateless JWT authentication, sprint Kanban pipelines, and automated task safety watchdogs.',
            security: 'Spring Security filter chain, bcrypt password hashing, stateless token verification, and granular method-level authorization.',
            techStack: 'Java, Spring Boot, Spring Security, JWT, React, Redux, PostgreSQL',
            repoUrl: 'https://github.com/sudharshanps/TaskGuard',
            demoUrl: ''
        },
        campusshield: {
            title: 'CampusShield — Web, API & AI Security Audit',
            tagline: '11 OWASP Top 10 Vulnerability Vectors & Prompt Injection Defense',
            problem: 'Educational web portals and campus APIs frequently run outdated software with unpatched OWASP Top 10 vulnerabilities.',
            solution: 'Conducted rigorous penetration testing across web services and modern LLM APIs using Nmap, Burp Suite, and OWASP ZAP, producing reproducible security remediation advisories.',
            security: 'Safe, sanctioned, educational laboratory testing methodology demonstrating defensive patch implementations.',
            techStack: 'OWASP Top 10, Burp Suite, OWASP ZAP, Nmap, AI Prompt Security',
            repoUrl: 'https://github.com/sudharshanps/CampusShield',
            demoUrl: ''
        },
        syllabus: {
            title: 'School Subject & Syllabus Management System',
            tagline: 'Spring Boot Academic Curriculum & Instructor Scheduling Architecture',
            problem: 'Schools face scheduling bottlenecks and manual syllabus tracking across diverse grade levels and departments.',
            solution: 'Automates curriculum tracking, instructor course assignments, and student syllabus completion status through a modular Spring Boot REST architecture.',
            security: 'Relational data integrity constraints in MySQL and sanitized REST request handlers.',
            techStack: 'Java, Spring Boot, Maven, REST APIs, MySQL',
            repoUrl: 'https://github.com/sudharshanps/School-Subject-Syllabus-Management-System',
            demoUrl: ''
        },
        gesture: {
            title: 'AI Gesture-Controlled Robot Car',
            tagline: 'Real-Time Computer Vision & Wireless IoT Teleoperation',
            problem: 'Traditional joystick robotics require physical contact and lack intuitive natural human-machine interfaces.',
            solution: 'Translates hand gestures recognized via MediaPipe into direction and velocity vectors, sent via Flask REST microservices over Wi-Fi to an ESP32 robotic car chassis.',
            security: 'Local Wi-Fi authentication and command buffer bounds checking to prevent actuation overrun.',
            techStack: 'Python, OpenCV, MediaPipe, Flask REST, ESP32, Wi-Fi Socket',
            repoUrl: 'https://github.com/sudharshanps/gesture-robot-car',
            demoUrl: ''
        },
        clinic: {
            title: 'Clinic Inventory Management System',
            tagline: 'Java & 3NF MySQL Pharmaceutical Supply Tracking',
            problem: 'Small clinics experience stockouts and medication expiry due to manual spreadsheet inventory tracking.',
            solution: 'Engineered a normalized 3NF relational database in MySQL connected via Java JDBC to automate stock reordering thresholds, supplier management, and dispensing logs.',
            security: 'PreparedStatements preventing SQL injection, transaction rollback on failure, and role segregation.',
            techStack: 'Java, MySQL, JDBC, Relational Schema Normalization (3NF)',
            repoUrl: 'https://github.com/sudharshanps/clinic-inventory-system',
            demoUrl: ''
        }
    };

    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalTagline = document.getElementById('modalTagline');
    const modalProblem = document.getElementById('modalProblem');
    const modalSolution = document.getElementById('modalSolution');
    const modalSecurity = document.getElementById('modalSecurity');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalActions = document.getElementById('modalActions');

    function openProjectModal(projId) {
        const data = projectCaseStudies[projId];
        if (!data || !projectModal) return;

        modalTitle.textContent = data.title;
        modalTagline.textContent = data.tagline;
        modalProblem.textContent = data.problem;
        modalSolution.textContent = data.solution;
        modalSecurity.textContent = data.security;
        modalTechStack.textContent = data.techStack;

        let actionsHtml = `<a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="bx bxl-github"></i> View GitHub Repository</a>`;
        if (data.demoUrl) {
            actionsHtml += `<a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-accent"><i class="bx bx-link-external"></i> Launch Live Demo</a>`;
        }
        modalActions.innerHTML = actionsHtml;

        projectModal.classList.add('open');
        playCyberBeep(840, 0.05);
    }

    function closeProjectModal() {
        if (projectModal) projectModal.classList.remove('open');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    const detailButtons = document.querySelectorAll('.open-details-btn');
    detailButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projId = btn.getAttribute('data-project');
            openProjectModal(projId);
        });
    });

    // ==========================================
    // 10. INTERACTIVE CYBERSECURITY LAB ENGINE
    // ==========================================
    // A. Password Strength & Shannon Entropy
    const pwdInput = document.getElementById('labPasswordInput');
    const togglePwd = document.getElementById('togglePasswordVisibility');
    const entropyFill = document.getElementById('entropyMeterFill');
    const entropyVal = document.getElementById('entropyVal');
    const crackTimeVal = document.getElementById('crackTimeVal');
    const strengthText = document.getElementById('strengthText');

    if (togglePwd && pwdInput) {
        togglePwd.addEventListener('click', () => {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                togglePwd.className = 'bx bx-hide lab-input-icon';
            } else {
                pwdInput.type = 'password';
                togglePwd.className = 'bx bx-show lab-input-icon';
            }
        });
    }

    if (pwdInput) {
        pwdInput.addEventListener('input', () => {
            const pwd = pwdInput.value;
            if (!pwd) {
                if (entropyFill) entropyFill.style.width = '0%';
                if (entropyVal) entropyVal.textContent = '0 bits';
                if (crackTimeVal) crackTimeVal.textContent = 'Instant';
                if (strengthText) strengthText.textContent = 'Score: None';
                return;
            }

            // Pool calculation
            let pool = 0;
            if (/[a-z]/.test(pwd)) pool += 26;
            if (/[A-Z]/.test(pwd)) pool += 26;
            if (/[0-9]/.test(pwd)) pool += 10;
            if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;
            if (pool === 0) pool = 1;

            // Shannon entropy bits: H = L * log2(pool)
            const entropy = Math.round(pwd.length * Math.log2(pool));
            entropyVal.textContent = `${entropy} bits`;

            // Crack time estimate (Assuming GPU cluster @ 10^10 hashes/sec)
            const combinations = Math.pow(pool, pwd.length);
            const seconds = combinations / 1e10;

            let crackTime = 'Instant';
            if (seconds < 1) crackTime = '< 1 sec';
            else if (seconds < 60) crackTime = `${Math.round(seconds)} secs`;
            else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} mins`;
            else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
            else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
            else if (seconds < 3.15e9) crackTime = `${Math.round(seconds / 31536000)} years`;
            else crackTime = 'Centuries+';

            crackTimeVal.textContent = crackTime;

            // Gauge fill & color
            const percent = Math.min(100, Math.round((entropy / 80) * 100));
            if (entropyFill) {
                entropyFill.style.width = `${percent}%`;
                if (entropy < 35) {
                    entropyFill.style.backgroundColor = '#f43f5e';
                    strengthText.textContent = 'Weak';
                    strengthText.style.color = '#f43f5e';
                } else if (entropy < 60) {
                    entropyFill.style.backgroundColor = '#fbbf24';
                    strengthText.textContent = 'Moderate';
                    strengthText.style.color = '#fbbf24';
                } else {
                    entropyFill.style.backgroundColor = '#10b981';
                    strengthText.textContent = 'Strong';
                    strengthText.style.color = '#10b981';
                }
            }
        });
    }

    // B. Phishing Email Simulator
    const inspectFlagsBtn = document.getElementById('inspectFlagsBtn');
    const flagBtnText = document.getElementById('flagBtnText');
    const flagCountText = document.getElementById('flagCountText');
    const flagTargets = document.querySelectorAll('.flag-target');
    let flagsRevealed = false;

    if (inspectFlagsBtn) {
        inspectFlagsBtn.addEventListener('click', () => {
            flagsRevealed = !flagsRevealed;
            if (flagsRevealed) {
                flagTargets.forEach((el) => {
                    el.classList.add('flagged-red');
                    el.setAttribute('title', el.getAttribute('data-flag'));
                });
                flagBtnText.textContent = 'Hide Red Flags';
                flagCountText.textContent = '5 Security Threats Detected!';
                playCyberBeep(520, 0.08);
            } else {
                flagTargets.forEach((el) => {
                    el.classList.remove('flagged-red');
                    el.removeAttribute('title');
                });
                flagBtnText.textContent = 'Inspect Red Flags';
                flagCountText.textContent = '';
            }
        });
    }

    // C. Safe Client-Side URL Analyzer
    const urlInput = document.getElementById('urlInput');
    const urlResults = document.getElementById('urlResults');
    const urlVerdict = document.getElementById('urlVerdict');
    const urlBreakdown = document.getElementById('urlBreakdown');

    function analyzeUrl(urlStr) {
        if (!urlStr) return;
        urlResults.style.display = 'block';

        let score = 0; // 0 = safe, 1 = suspicious, 2+ = dangerous
        let reasons = [];

        // 1. Protocol check
        if (urlStr.startsWith('http://')) {
            score += 1;
            reasons.push('Insecure Protocol: Uses plain HTTP instead of encrypted HTTPS.');
        } else if (urlStr.startsWith('https://')) {
            reasons.push('Encrypted Protocol: Valid HTTPS scheme detected.');
        }

        // 2. IP in hostname
        if (/\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlStr)) {
            score += 2;
            reasons.push('Raw IP Hostname: Bypasses DNS domain reputation checks.');
        }

        // 3. Suspicious TLDs
        if (/\.(tk|xyz|top|ml|ga|cf|gq|work|fit)($|\/)/i.test(urlStr)) {
            score += 2;
            reasons.push('High-Risk TLD: Common top-level domain associated with disposable phishing campaigns.');
        }

        // 4. Phishing keywords
        if (/(login|verify|secure|update|banking|account-alert)/i.test(urlStr) && !/(skcet|google|github|render)\./i.test(urlStr)) {
            score += 1;
            reasons.push('Deceptive Phishing Keyword: Uses high-urgency credential terms.');
        }

        if (score === 0) {
            urlVerdict.className = 'url-verdict safe';
            urlVerdict.textContent = 'VERDICT: SAFE / LOW RISK';
        } else if (score === 1) {
            urlVerdict.className = 'url-verdict suspicious';
            urlVerdict.textContent = 'VERDICT: SUSPICIOUS';
        } else {
            urlVerdict.className = 'url-verdict malicious';
            urlVerdict.textContent = 'VERDICT: HIGH PHISHING RISK';
        }

        urlBreakdown.innerHTML = reasons.map((r) => `<div>&bull; ${r}</div>`).join('');
        playCyberBeep(score > 1 ? 400 : 780, 0.06);
    }

    if (urlInput) {
        urlInput.addEventListener('change', () => analyzeUrl(urlInput.value));
        urlInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') analyzeUrl(urlInput.value);
        });
    }

    const sampleSafe = document.getElementById('sampleUrlSafe');
    const samplePhish = document.getElementById('sampleUrlPhish');
    const sampleIp = document.getElementById('sampleUrlIp');

    if (sampleSafe) {
        sampleSafe.addEventListener('click', () => {
            urlInput.value = 'https://skcet.ac.in/departments/cyber-security';
            analyzeUrl(urlInput.value);
        });
    }
    if (samplePhish) {
        samplePhish.addEventListener('click', () => {
            urlInput.value = 'http://login.verify-account-update.tk/auth';
            analyzeUrl(urlInput.value);
        });
    }
    if (sampleIp) {
        sampleIp.addEventListener('click', () => {
            urlInput.value = 'http://192.168.1.105:8080/credentials.php';
            analyzeUrl(urlInput.value);
        });
    }

    // ==========================================
    // 11. INTERACTIVE DEVELOPER TERMINAL ENGINE
    // ==========================================
    const terminalModal = document.getElementById('terminalModal');
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    const navTerminalBtn = document.getElementById('navTerminalBtn');
    const terminalFloatBtn = document.getElementById('terminalFloatBtn');
    const mobileTerminalTrigger = document.getElementById('mobileTerminalTrigger');
    const contactTerminalTrigger = document.getElementById('contactTerminalTrigger');
    const termCloseDot = document.getElementById('termCloseDot');
    const termMinDot = document.getElementById('termMinDot');
    const termHelpDot = document.getElementById('termHelpDot');

    const commandHistory = [];
    let historyIdx = -1;

    function openTerminal() {
        if (!terminalModal) return;
        terminalModal.classList.add('open');
        playCyberBeep(900, 0.05);
        if (terminalInput) {
            terminalInput.focus();
        }
    }

    function closeTerminal() {
        if (terminalModal) terminalModal.classList.remove('open');
    }

    function toggleTerminal() {
        if (!terminalModal) return;
        if (terminalModal.classList.contains('open')) {
            closeTerminal();
        } else {
            openTerminal();
        }
    }

    if (navTerminalBtn) navTerminalBtn.addEventListener('click', toggleTerminal);
    if (terminalFloatBtn) terminalFloatBtn.addEventListener('click', toggleTerminal);
    if (mobileTerminalTrigger) mobileTerminalTrigger.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        openTerminal();
    });
    if (contactTerminalTrigger) contactTerminalTrigger.addEventListener('click', openTerminal);
    if (termCloseDot) termCloseDot.addEventListener('click', closeTerminal);
    if (termMinDot) termMinDot.addEventListener('click', () => {
        if (terminalBody) terminalBody.innerHTML = '<div style="color: var(--text-muted);">Terminal screen cleared.</div>';
    });
    if (termHelpDot) termHelpDot.addEventListener('click', () => handleCommand('help'));

    if (terminalModal) {
        terminalModal.addEventListener('click', (e) => {
            if (e.target === terminalModal) closeTerminal();
        });
    }

    function handleCommand(cmdRaw) {
        const cmd = cmdRaw.trim().toLowerCase();
        if (!cmd) return;

        commandHistory.push(cmdRaw);
        historyIdx = commandHistory.length;

        // Echo command
        const cmdEcho = document.createElement('div');
        cmdEcho.innerHTML = `<span style="color: var(--royal-blue); font-weight: 700;">sudharshan@codex:~$</span> <span style="color: var(--navy-text);">${escapeHtml(cmdRaw)}</span>`;
        terminalBody.appendChild(cmdEcho);

        const resp = document.createElement('div');
        resp.style.margin = '0.3rem 0 0.65rem';

        switch (cmd) {
            case 'help':
                resp.innerHTML = `
                    <div style="color: var(--deep-blue); font-weight: 700;">AVAILABLE COMMANDS:</div>
                    <div>&bull; <strong>about</strong>: Professional biography &amp; background</div>
                    <div>&bull; <strong>skills</strong>: Core technical skills breakdown</div>
                    <div>&bull; <strong>projects</strong>: 10 featured engineering projects</div>
                    <div>&bull; <strong>startups</strong>: SudharshanTech &amp; Zentriq venture profiles</div>
                    <div>&bull; <strong>experience</strong>: Professional internship timeline</div>
                    <div>&bull; <strong>achievements</strong>: Verified honors &amp; certifications</div>
                    <div>&bull; <strong>lab</strong>: Interactive cybersecurity tools</div>
                    <div>&bull; <strong>contact</strong>: Email, phone, LinkedIn &amp; GitHub links</div>
                    <div>&bull; <strong>resume</strong>: Download ATS Resume (PDF)</div>
                    <div>&bull; <strong>github</strong>: Open GitHub repositories</div>
                    <div>&bull; <strong>clear</strong>: Clear terminal buffer</div>
                    <div>&bull; <strong>sudo</strong>: Administrative elevated privileges</div>
                    <div>&bull; <strong>date</strong>: System timestamps</div>
                `;
                break;
            case 'about':
                resp.innerHTML = `
                    <div style="color: var(--royal-blue); font-weight: 700;">SUDHARSHAN P S</div>
                    <div>Aspiring Software Engineer | Cybersecurity &amp; AI Developer</div>
                    <div>Institution: Sri Krishna College of Engineering &amp; Technology (SKCET)</div>
                    <div>Specialization: B.E. CSE (Cyber Security) | CGPA: 8.5 / 10</div>
                    <div>Focus: Defense in Depth, Computer Vision, Secure Distributed Systems</div>
                `;
                break;
            case 'skills':
                resp.innerHTML = `
                    <div><strong>Languages:</strong> Python, Java, C++, JavaScript, TypeScript, SQL</div>
                    <div><strong>Cybersecurity:</strong> Threat SAST, OWASP Top 10, SIEM, CVE Research, Burp Suite, Nmap</div>
                    <div><strong>AI / Vision:</strong> Computer Vision, OpenCV, MediaPipe FaceMesh, Scikit-learn</div>
                    <div><strong>Full-Stack:</strong> React.js, Next.js, FastAPI, Spring Boot, PostgreSQL, Docker</div>
                `;
                break;
            case 'projects':
                resp.innerHTML = `
                    <div style="color: var(--royal-blue); font-weight: 700;">10 FEATURED PROJECTS:</div>
                    <div>1. CredSense AI (Git Secret Detection SAST - Live on Render)</div>
                    <div>2. AI-Powered Cybersecurity Threat Detection Platform</div>
                    <div>3. DRISHTI 360 (Farm-to-Market Agri Intelligence)</div>
                    <div>4. NidhiVizh / NIDHI SETU (Financial Risk Investigation)</div>
                    <div>5. Hackademia (AI Exam Invigilation - National AI Hackathon Top 50)</div>
                    <div>6. TaskGuard (Enterprise Task Safety &amp; Spring Boot RBAC)</div>
                    <div>7. CampusShield (11-Vector OWASP Audit &amp; Prompt Defense)</div>
                    <div>8. School Subject &amp; Syllabus Management (Enterprise Java)</div>
                    <div>9. AI Gesture-Controlled Robot Car (OpenCV + ESP32 Wi-Fi)</div>
                    <div>10. Clinic Inventory Management System (3NF MySQL + JDBC)</div>
                `;
                break;
            case 'startups':
                resp.innerHTML = `
                    <div style="color: var(--royal-blue); font-weight: 700;">ENTREPRENEURIAL VENTURES:</div>
                    <div>&bull; <strong>SUDHARSHAN_TECH</strong>: Technology, Cybersecurity &amp; Software Brand.</div>
                    <div>&nbsp; Tagline: CODE. CREATE. ELEVATE. | Live: sudharshan-tech.onrender.com</div>
                    <div>&bull; <strong>ZENTRIQ</strong>: Tech Solutions Venture.</div>
                    <div>&nbsp; Focus: Enterprise Cloud Architecture, AI System Integrations &amp; Secure Microservices.</div>
                `;
                break;
            case 'experience':
                resp.innerHTML = `
                    <div>1. Cybersecurity Content Intern &mdash; XECUREONE (June 2026 – July 2026)</div>
                    <div>2. UI/UX Design Intern &mdash; Technico Laboratory Products (May 2026 – June 2026)</div>
                    <div>3. UI/UX Design Intern &mdash; Future Interns (March 2026 – April 2026)</div>
                    <div>4. Junior Software Developer Intern &mdash; Yuva Intern (Jan 2026 – Feb 2026)</div>
                `;
                break;
            case 'achievements':
                resp.innerHTML = `
                    <div>&bull; <strong>National AI Hackathon:</strong> Top 50 Finalist (out of 500+ teams)</div>
                    <div>&bull; <strong>YUGAM Tex-Research Hackathon:</strong> 2nd Runner-Up</div>
                    <div>&bull; <strong>SKCET Cybersecurity Club:</strong> Active Contributor</div>
                    <div>&bull; <strong>Technical Peer Mentor:</strong> Algorithms &amp; Security</div>
                    <div>&bull; <strong>Certifications:</strong> Vanderbilt University, Microsoft, Google, Forage</div>
                `;
                break;
            case 'lab':
                resp.innerHTML = `
                    <div>Cybersecurity Lab Modules:</div>
                    <div>1. Password Strength &amp; Shannon Entropy Analyzer</div>
                    <div>2. Phishing Email Social Engineering Simulator</div>
                    <div>3. Safe Client-Side URL Heuristic Inspector</div>
                    <div>4. OWASP Top 10 Defensive Mitigation Matrix</div>
                `;
                break;
            case 'contact':
                resp.innerHTML = `
                    <div>Email: <a href="mailto:sudharshanthemagnet@gmail.com" style="color: var(--neon-cyan);">sudharshanthemagnet@gmail.com</a></div>
                    <div>Phone: +91 9791495418</div>
                    <div>LinkedIn: linkedin.com/in/sudharshan-ps-5a6b9a325</div>
                    <div>GitHub: github.com/sudharshanps</div>
                    <div>Location: Coimbatore, Tamil Nadu, India</div>
                `;
                break;
            case 'resume':
                resp.innerHTML = `<div>Launching resume download...</div>`;
                window.location.href = 'Sudharshan_PS_Resume.pdf';
                break;
            case 'github':
                resp.innerHTML = `<div>Redirecting to GitHub: https://github.com/sudharshanps</div>`;
                window.open('https://github.com/sudharshanps', '_blank');
                break;
            case 'clear':
                terminalBody.innerHTML = '';
                return;
            case 'sudo':
                resp.innerHTML = `<span style="color: var(--alert-rose);">SECURITY ALERT: User 'guest' is not in the sudoers file. Incident reported. (Principle of Least Privilege in effect).</span>`;
                playCyberBeep(320, 0.1);
                break;
            case 'date':
                resp.textContent = new Date().toUTCString();
                break;
            default:
                resp.innerHTML = `<span style="color: var(--alert-rose);">Command not recognized: '${escapeHtml(cmd)}'. Type 'help' for available commands.</span>`;
                break;
        }

        terminalBody.appendChild(resp);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        playKeyClickSound();
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                terminalInput.value = '';
                handleCommand(val);
            } else if (e.key === 'ArrowUp') {
                if (historyIdx > 0) {
                    historyIdx--;
                    terminalInput.value = commandHistory[historyIdx] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIdx < commandHistory.length - 1) {
                    historyIdx++;
                    terminalInput.value = commandHistory[historyIdx] || '';
                } else {
                    historyIdx = commandHistory.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    // ==========================================
    // 12. PERSONAL AI ASSISTANT (SUDHARSHAN.AI)
    // ==========================================
    const aiModal = document.getElementById('aiAssistantModal');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiChatBody = document.getElementById('aiChatBody');
    const aiInputField = document.getElementById('aiInputField');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const navAiBtn = document.getElementById('navAiBtn');
    const aiFloatBtn = document.getElementById('aiFloatBtn');
    const mobileAiTrigger = document.getElementById('mobileAiTrigger');
    const contactAiTrigger = document.getElementById('contactAiTrigger');
    const promptChips = document.querySelectorAll('.ai-prompt-chip');

    function openAiAssistant() {
        if (!aiModal) return;
        aiModal.classList.add('open');
        playCyberBeep(940, 0.05);
        if (aiInputField) aiInputField.focus();
    }

    function closeAiAssistant() {
        if (aiModal) aiModal.classList.remove('open');
    }

    if (navAiBtn) navAiBtn.addEventListener('click', openAiAssistant);
    if (aiFloatBtn) aiFloatBtn.addEventListener('click', openAiAssistant);
    if (mobileAiTrigger) mobileAiTrigger.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        openAiAssistant();
    });
    if (contactAiTrigger) contactAiTrigger.addEventListener('click', openAiAssistant);
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeAiAssistant);

    if (aiModal) {
        aiModal.addEventListener('click', (e) => {
            if (e.target === aiModal) closeAiAssistant();
        });
    }

    function appendAiMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;

        if (sender === 'ai') {
            msgDiv.innerHTML = `
                <div class="ai-avatar-icon" style="width: 26px; height: 26px; font-size: 0.9rem; flex-shrink: 0;"><i class="bx bx-bot"></i></div>
                <div class="ai-msg-bubble">${text}</div>
            `;
        } else {
            msgDiv.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
        }

        aiChatBody.appendChild(msgDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function generateAiResponse(userQuery) {
        const q = userQuery.toLowerCase();
        let answer = '';

        if (q.includes('who is') || q.includes('about') || q.includes('sudharshan')) {
            answer = `<strong>Sudharshan P S</strong> is a Computer Science and Engineering student specializing in <strong>Cyber Security</strong> at Sri Krishna College of Engineering and Technology, Coimbatore (CGPA 8.5/10). He is an engineer and entrepreneur passionate about building secure, intelligent, and scalable software solutions.`;
        } else if (q.includes('startup') || q.includes('sudharshantech') || q.includes('zentriq')) {
            answer = `Sudharshan spearheads two technology ventures:<br><br>
                1. <strong>SUDHARSHAN_TECH</strong> (CODE. CREATE. ELEVATE.) &mdash; Founded by Sudharshan. A technology, cybersecurity, and software brand delivering digital products and consulting. Deployed at <a href="https://sudharshan-tech.onrender.com/" target="_blank" style="color: var(--neon-cyan); text-decoration: underline;">sudharshan-tech.onrender.com</a>.<br><br>
                2. <strong>ZENTRIQ</strong> (Tech Solutions Venture) &mdash; Systems architecture venture focusing on high-throughput cloud platforms, secure microservices, and AI integrations.`;
        } else if (q.includes('project') || q.includes('built') || q.includes('developed')) {
            answer = `Sudharshan has engineered 10 verified real-world projects, including:<br>
                &bull; <strong>CredSense AI:</strong> Git secret detection & SAST analysis (Live on Render).<br>
                &bull; <strong>AI Threat Detection:</strong> Phishing defense via FastAPI & Scikit-learn.<br>
                &bull; <strong>DRISHTI 360:</strong> Computer vision crop inspection & QR traceability.<br>
                &bull; <strong>NidhiVizh:</strong> Evidence-driven financial risk investigation bridge.<br>
                &bull; <strong>Hackademia:</strong> AI online proctoring (Top 50 Finalist at National AI Hackathon).<br>
                &bull; <strong>TaskGuard:</strong> Java Spring Boot RBAC enterprise task system.`;
        } else if (q.includes('cyber') || q.includes('security') || q.includes('owasp')) {
            answer = `Sudharshan specializes in defensive cybersecurity engineering: CVE vulnerability research, OWASP Top 10 auditing, static application security testing (SAST), SIEM workflows, and secure authentication (stateless JWT RBAC). Check out the <strong>Interactive Cyber Lab</strong> in Spread 3 of the codex!`;
        } else if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
            answer = `You can download Sudharshan's verified ATS Resume directly: <a href="Sudharshan_PS_Resume.pdf" download="Sudharshan_PS_Resume.pdf" style="color: var(--neon-cyan); text-decoration: underline; font-weight: 700;">Click Here to Download PDF</a>.`;
        } else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone')) {
            answer = `You can connect with Sudharshan directly:<br>
                &bull; Email: <a href="mailto:sudharshanthemagnet@gmail.com" style="color: var(--neon-cyan);">sudharshanthemagnet@gmail.com</a><br>
                &bull; Phone: +91 9791495418<br>
                &bull; LinkedIn: <a href="https://linkedin.com/in/sudharshan-ps-5a6b9a325" target="_blank" style="color: var(--neon-cyan);">linkedin.com/in/sudharshan-ps</a><br>
                &bull; GitHub: <a href="https://github.com/sudharshanps" target="_blank" style="color: var(--neon-cyan);">github.com/sudharshanps</a>`;
        } else {
            answer = `I understand you're inquiring about "<em>${escapeHtml(userQuery)}</em>". Sudharshan specializes in AI/ML, defensive cybersecurity engineering, full-stack architectures (FastAPI, React, Spring Boot), and technology startups. Feel free to explore his projects in Spread 2 or contact him directly via email!`;
        }

        setTimeout(() => {
            appendAiMessage('ai', answer);
            playCyberBeep(750, 0.04);
        }, 350);
    }

    function handleAiSubmit() {
        if (!aiInputField) return;
        const text = aiInputField.value.trim();
        if (!text) return;
        aiInputField.value = '';
        appendAiMessage('user', text);
        generateAiResponse(text);
    }

    if (aiSendBtn) aiSendBtn.addEventListener('click', handleAiSubmit);
    if (aiInputField) {
        aiInputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAiSubmit();
        });
    }

    promptChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            appendAiMessage('user', prompt);
            generateAiResponse(prompt);
        });
    });

    // ==========================================
    // 13. CONTACT FORM & CLIPBOARD COPY
    // ==========================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('sudharshanthemagnet@gmail.com').then(() => {
                copyEmailBtn.innerHTML = "<i class='bx bx-check'></i>";
                copyEmailBtn.title = 'Email copied to clipboard!';
                playCyberBeep(880, 0.05);
                setTimeout(() => {
                    copyEmailBtn.innerHTML = "<i class='bx bx-copy'></i>";
                    copyEmailBtn.title = 'Copy email address';
                }, 2000);
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    const contactFeedback = document.getElementById('contactFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in your name, email, and message.');
                return;
            }

            // Real Backend API Submission with Fallback
            if (contactFeedback) {
                contactFeedback.style.display = 'block';
                contactFeedback.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Submitting message to backend server...`;
            }

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    playCyberBeep(880, 0.08);
                    if (contactFeedback) {
                        contactFeedback.innerHTML = `<i class='bx bx-check-circle'></i> <strong>Delivered to Local Backend!</strong> ${data.message} <span style="font-size: 0.68rem; opacity: 0.8;">(ID: ${data.inquiryId})</span>`;
                        contactFeedback.style.color = 'var(--success-emerald)';
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.error || 'Server error');
                }
            })
            .catch(err => {
                // Graceful fallback to mailto if offline or static server
                console.warn('[CONTACT] Backend API unavailable, falling back to mail client:', err);
                const mailSubject = encodeURIComponent(`Portfolio Inquiry: ${subject || 'Opportunity'} (from ${name})`);
                const mailBody = encodeURIComponent(
                    `Hello Sudharshan,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\n`
                );
                const mailtoUrl = `mailto:sudharshanthemagnet@gmail.com?subject=${mailSubject}&body=${mailBody}`;

                if (contactFeedback) {
                    contactFeedback.innerHTML = `<i class='bx bx-envelope'></i> Launching mail client for <strong>sudharshanthemagnet@gmail.com</strong>...`;
                }
                window.location.href = mailtoUrl;
                setTimeout(() => contactForm.reset(), 2500);
            });
        });
    }

    // Vision Deck Button
    const zentriqDeckBtn = document.getElementById('zentriqDeckBtn');
    if (zentriqDeckBtn) {
        zentriqDeckBtn.addEventListener('click', () => {
            openAiAssistant();
            setTimeout(() => {
                appendAiMessage('user', 'Tell me about the ZENTRIQ Tech Solutions Vision Deck');
                generateAiResponse('Tell me about his startups');
            }, 300);
        });
    }

    function closeAllModals() {
        closeProjectModal();
        closeTerminal();
        closeAiAssistant();
        if (mobileDrawer) mobileDrawer.classList.remove('open');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ==========================================
    // 14. INITIAL CINEMATIC OPENING SEQUENCE
    // ==========================================
    const coverRight = document.querySelector('.cover.cover-right');
    if (coverRight) {
        setTimeout(() => {
            coverRight.classList.add('turn');
            playPageTurnSound();
        }, 850);

        setTimeout(() => {
            coverRight.style.zIndex = -1;
            goToSpread(0);
        }, 1900);
    }
});
