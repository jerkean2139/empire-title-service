/**
 * Main animations file for Twenty Twenty-Four theme
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.from('.hero-title', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.hero-button', {
            duration: 1,
            y: 20,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });
    }

    // Animate main content blocks
    gsap.utils.toArray('.wp-block-group').forEach((group, i) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: group,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });

    // Team member cards animation
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.2
        });
    });

    // Location cards animation
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.2
        });
    });

    // Navigation menu animation
    const navItems = document.querySelectorAll('.nav-menu-item');
    gsap.from(navItems, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power2.out'
    });
});

// Window load animations
window.addEventListener('load', () => {
    // Page transition
    gsap.to('.page-transition', {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            document.querySelector('.page-transition')?.remove();
        }
    });
});

// Helper function for scroll animations
function createScrollAnimation(elements, config = {}) {
    gsap.utils.toArray(elements).forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse',
                ...config.scrollTrigger
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ...config.animation
        });
    });
}