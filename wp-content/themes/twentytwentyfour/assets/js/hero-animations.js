document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation Timeline
    const heroTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            duration: 1.5
        }
    });

    heroTimeline
        .from('.site-header', {
            y: -100,
            opacity: 0,
            duration: 1
        })
        .from('.hero-title', {
            y: 50,
            opacity: 0,
            duration: 1.2
        }, '-=0.5')
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1
        }, '-=0.8')
        .from('.hero-actions', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.6');

    // Create floating background effect
    gsap.to('.hero-background', {
        backgroundPosition: '100% 100%',
        repeat: -1,
        duration: 20,
        ease: 'none',
        yoyo: true
    });

    // Navigation hover effects
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                color: 'rgb(175, 35, 43)',
                duration: 0.3
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                color: 'white',
                duration: 0.3
            });
        });
    });
});