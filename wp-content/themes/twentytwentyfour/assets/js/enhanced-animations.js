document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Enhanced service card animations
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        const iconPath = card.querySelector('.service-icon svg path');
        
        // Create floating animation for icons
        gsap.to(icon, {
            y: -10,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        // Hover effect timeline
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl
            .to(card, {
                scale: 1.02,
                backgroundColor: 'rgba(175, 35, 43, 0.15)',
                boxShadow: '0 20px 40px rgba(175, 35, 43, 0.2)',
                duration: 0.3
            })
            .to(icon, {
                backgroundColor: 'rgba(175, 35, 43, 0.3)',
                rotate: 180,
                duration: 0.5,
                ease: "power2.out"
            }, 0)
            .to(iconPath, {
                fill: 'rgba(175, 35, 43, 0.8)',
                stroke: 'rgb(175, 35, 43)',
                duration: 0.3
            }, 0);

        // Add hover listeners
        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Section transitions
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Parallax background effect
    sections.forEach(section => {
        if (section.querySelector('.section-background')) {
            gsap.to(section.querySelector('.section-background'), {
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: "20%",
                ease: "none"
            });
        }
    });

    // Smooth scroll between sections
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(e.currentTarget.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Floating particles background
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-background';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);

            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const size = Math.random() * 3 + 1;

            gsap.set(particle, {
                x: x,
                y: y,
                width: size,
                height: size,
                backgroundColor: 'rgba(175, 35, 43, 0.3)'
            });

            gsap.to(particle, {
                y: y - 200,
                x: x + (Math.random() - 0.5) * 200,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                ease: "none",
                opacity: Math.random() * 0.5,
                yoyo: true
            });
        }
    };

    createParticles();

    // Add the necessary styles
    const style = document.createElement('style');
    style.textContent = `
        .particles-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        }

        section {
            position: relative;
            overflow: hidden;
        }

        .section-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 120%;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
});