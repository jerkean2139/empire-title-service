document.addEventListener('DOMContentLoaded', () => {
    // Get all service cards
    const serviceCards = document.querySelectorAll('.service-card');

    // Create hover animations for each card
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('h3');
        const text = card.querySelector('p');

        // Create hover timeline
        const hoverTimeline = gsap.timeline({ paused: true });

        hoverTimeline
            .to(card, {
                y: -10,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 10px 30px rgba(175, 35, 43, 0.2)',
                duration: 0.3
            })
            .to(icon, {
                backgroundColor: 'rgba(175, 35, 43, 0.2)',
                scale: 1.1,
                duration: 0.3
            }, 0)
            .to(title, {
                color: 'rgb(175, 35, 43)',
                y: -2,
                duration: 0.3
            }, 0)
            .to(text, {
                opacity: 0.9,
                y: -2,
                duration: 0.3
            }, 0);

        // Add hover listeners
        card.addEventListener('mouseenter', () => hoverTimeline.play());
        card.addEventListener('mouseleave', () => hoverTimeline.reverse());
    });

    // Scroll reveal animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
});