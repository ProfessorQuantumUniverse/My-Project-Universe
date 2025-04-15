document.addEventListener('DOMContentLoaded', () => {

    // === PRELOADER ===
    const body = document.body;
    const preloader = document.querySelector('.preloader');

    // Mindestens 1 Sek anzeigen, dann auf window.onload warten
    let preloaderMinTime = setTimeout(() => {
        preloaderMinTime = null;
        if (!body.classList.contains('loading')) { // Falls onload schon fertig war
             hidePreloader();
        }
    }, 1000);

    window.addEventListener('load', () => {
        body.classList.remove('loading'); // Ermöglicht Body Fade-In
        if (!preloaderMinTime) { // Falls Mindestzeit schon um ist
             hidePreloader();
        }
    });

    function hidePreloader() {
        if (preloader) {
             // Hier könnte man noch eine GSAP Outro-Animation für den Preloader machen
             preloader.style.opacity = '0';
             preloader.style.visibility = 'hidden';
        }
         // Start Intro-Animationen NACH Preloader
         startIntroAnimations();
    }


    // === GSAP & SCROLLTRIGGER INIT ===
    gsap.registerPlugin(ScrollTrigger);

    // Standard-Einstellungen für ScrollTrigger erleichtern das Leben
    ScrollTrigger.defaults({
        // markers: true, // Zum Debuggen einschalten!
        toggleActions: "play none none none", // Standard: Nur einmal abspielen
        start: "top 85%", // Standard-Startpunkt
    });


    // === PARTICLES.JS INIT (Kosmischer Look) ===
    particlesJS('particles-js', {
        particles: {
            number: { value: 200, density: { enable: true, value_area: 1200 } }, // Mehr Sterne, etwas weiter verteilt
            color: { value: ["#8b949e", "#58a6ff", "#c9d1d9", "#bc8cff"] }, // Farben aus Palette
            shape: { type: "circle" },
            opacity: { value: 0.7, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } },
            size: { value: 1.5, random: true, anim: { enable: false } },
            line_linked: { enable: true, distance: 50, color: "#30363d", opacity: 0.15, width: 1 }, // Sehr subtile Linien
            move: { enable: true, speed: 0.3, direction: "none", random: true, straight: false, out_mode: "out", attract: { enable: false } }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: false } },
            modes: { bubble: { distance: 100, size: 2.5, duration: 2, opacity: 1 } }
        },
        retina_detect: true
    });


    // === ANIMATIONEN ===

    // -- Intro Animationen (werden von hidePreloader() aufgerufen) --
    function startIntroAnimations() {
        const tlIntro = gsap.timeline({ delay: 0.2 }); // Kleiner Delay nach Preloader

        // Headline Buchstaben Reveal (mit SplitType)
        const heroHeadline = document.querySelector('.hero-headline');
        if (heroHeadline && typeof SplitType !== 'undefined') {
            const split = new SplitType(heroHeadline, { types: 'chars' });
            tlIntro.from(split.chars, {
                yPercent: 110, // Startet von unten
                opacity: 0,
                rotationZ: 10, // Leichte Drehung
                stagger: 0.03,
                duration: 1.2,
                ease: "expo.out",
            });
        } else if (heroHeadline) { // Fallback ohne SplitType
            tlIntro.fromTo(heroHeadline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
        }

        // Andere Hero Elemente Fade Up
        tlIntro.fromTo(".gsap-fade-up",
           { opacity: 0, y: 30 },
           { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.15 },
           "-=0.8" // Überlappt leicht mit Headline
        );
    }

    // -- Hero Parallax Background --
    gsap.utils.toArray(".hero-layer").forEach(layer => {
        const depth = layer.dataset.depth || 0; // Tiefe aus data-Attribut
        const movement = -(depth * 150); // Stärke des Effekts anpassen
        gsap.to(layer, {
            y: movement, // Bewegung nach oben beim Runterscrollen
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1.5 // Etwas sanfter als scrub: true
            }
        });
    });

    // -- Allgemeine Scroll-Triggered Fades & Reveals --
    // Fade In (nur Opazität)
    gsap.utils.toArray(".gsap-fade-in").forEach(el => {
        gsap.from(el, {
            opacity: 0,
            duration: 1.2,
            ease: "power1.out",
            scrollTrigger: { trigger: el }
        });
    });

    // Fade Up (Opazität & Y-Position)
    gsap.utils.toArray(".gsap-fade-up").forEach(el => { // Erneut für Elemente außerhalb Hero
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1.2,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: { trigger: el }
        });
    });

    // Section Decorator Line Reveal
    gsap.utils.toArray(".gsap-line-reveal").forEach(line => {
        gsap.to(line, {
            scaleX: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
                trigger: line.closest('.section-header') || line.closest('.content-section'), // Finde Eltern-Trigger
                start: "top 75%" // Etwas früher starten
            }
        });
    });

    // Projektkarten Reveal mit Stagger
    const projectCards = gsap.utils.toArray(".projekt-karte.gsap-scroll-reveal");
    if (projectCards.length > 0) {
        gsap.from(projectCards, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.8,
            ease: "power1.out",
            stagger: 0.1, // Karten erscheinen nacheinander
            scrollTrigger: {
                trigger: ".projekt-grid", // Trigger ist das Grid
                start: "top 80%", // Wenn das Grid sichtbar wird
            }
        });
    }

     // Social Icons Stagger Reveal
    const socialIcons = gsap.utils.toArray(".social-links-immersive a");
    if (socialIcons.length > 0) {
         gsap.from(socialIcons, {
            opacity: 0,
            scale: 0.5,
            y: 20,
            duration: 0.6,
            ease: "back.out(1.7)", // Schöner Bounce-Effekt
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".social-links-immersive",
                start: "top 85%"
            }
         });
    }


    // --- Magnetic Buttons/Links (optional, cooler Effekt) ---
    function applyMagneticEffect(elements) {
        elements.forEach(el => {
            const intensity = parseFloat(el.dataset.magneticIntensity) || 0.3; // Stärke anpassen
            const ease = "power2.out";

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(el, {
                    x: x * intensity,
                    y: y * intensity,
                    duration: 0.4,
                    ease: ease
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)" // Springt zurück
                });
            });
        });
    }
    const magneticElements = document.querySelectorAll('.magnetic');
    if (magneticElements.length > 0) {
         applyMagneticEffect(magneticElements);
    }


    // === FOOTER YEAR ===
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) { yearElement.textContent = currentYear; }


    // === EASTER EGG (Konami Code) ===
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let easterEggActive = false;

    let easterEggOverlay = document.querySelector('.easter-egg-overlay');
    // Falls Overlay noch nicht im DOM war (z.B. wenn CSS nicht geladen):
    if (!easterEggOverlay) {
        easterEggOverlay = document.createElement('div');
        easterEggOverlay.classList.add('easter-egg-overlay');
        // Minimales Styling oder Verweis auf CSS hinzufügen
        easterEggOverlay.innerHTML = `
            <p>HYPERDRIVE ACTIVATED!</p>
            <p>Quantum entanglement protocols engaged. Reality matrix unstable.</p>
            <span>(Click anywhere to stabilize reality field)</span>
        `;
        document.body.appendChild(easterEggOverlay);
    }

     easterEggOverlay.addEventListener('click', () => {
        easterEggOverlay.style.display = 'none';
        konamiIndex = 0;
        easterEggActive = false;
    });

    document.addEventListener('keydown', (e) => {
        if (easterEggActive) return;
        const requiredKey = konamiCode[konamiIndex].toLowerCase();
        const pressedKey = e.key.toLowerCase();

        if (pressedKey === requiredKey) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                console.log('Konami Code Accepted! Engaging Hyperdrive...');
                if(easterEggOverlay) easterEggOverlay.style.display = 'flex';
                easterEggActive = true;
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0; // Reset bei falscher Taste
        }
    });

    console.log("Psst... An ancient sequence might bend spacetime... (↑ ↑ ↓ ↓ ← → ← → B A)");


    // === SCROLLTRIGGER REFRESH ON RESIZE ===
    // Wichtig für korrekte Triggerpunkte nach Größenänderung
    ScrollTrigger.addEventListener("refresh", () => {
        // Neuberechnungen hier, falls nötig
        console.log("ScrollTrigger positions refreshed.");
    });

    // Initiales Refresh erzwingen, falls nötig (manchmal bei komplexen Layouts)
    // ScrollTrigger.refresh();

}); // Ende DOMContentLoaded
