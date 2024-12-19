document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation
    const heroTimeline = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' }
    });

    heroTimeline
        .from('.hero-title', {
            y: 50,
            opacity: 0
        })
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0
        }, '-=0.7')
        .from('.hero-buttons', {
            y: 20,
            opacity: 0
        }, '-=0.7')
        .from('.hero-image', {
            x: 50,
            opacity: 0,
        }, '-=0.7');

    // Services Section Animation
    const serviceCards = gsap.utils.toArray('.service-card');
    serviceCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });

    // Features Animation
    gsap.from('.feature-content h2', {
        scrollTrigger: {
            trigger: '.feature-content',
            start: 'top bottom-=100'
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });

    // Feature List Items Animation
    const featureItems = gsap.utils.toArray('.feature-list li');
    featureItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top bottom-=50'
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.2
        });
    });

    // Feature Image Animation
    gsap.from('.feature-image', {
        scrollTrigger: {
            trigger: '.feature-image',
            start: 'top bottom-=100'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1
    });

    // CTA Section Animation
    gsap.from('.cta-content', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top bottom-=100'
        },
        y: 50,
        opacity: 0,
        duration: 1
    });

    // Hover Animations
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});