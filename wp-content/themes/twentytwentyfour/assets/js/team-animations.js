// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Initial page load animations
    const pageLoadTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    pageLoadTimeline
        .from('.team-page-title', {
            y: 100,
            opacity: 0,
            duration: 1.2
        })
        .from('.team-page-header', {
            opacity: 0,
            duration: 1
        }, "-=0.8");

    // Team member cards animation
    const teamCards = gsap.utils.toArray('.team-member-card');
    
    teamCards.forEach((card, index) => {
        // Create hover animation timeline
        const hoverTimeline = gsap.timeline({ paused: true });
        const image = card.querySelector('.team-member-image');
        const content = card.querySelector('.team-member-content');

        hoverTimeline
            .to(card, {
                y: -10,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                duration: 0.4
            })
            .to(image, {
                scale: 1.1,
                duration: 0.4
            }, 0)
            .to(content, {
                y: -5,
                duration: 0.4
            }, 0);

        // Hover events
        card.addEventListener('mouseenter', () => hoverTimeline.play());
        card.addEventListener('mouseleave', () => hoverTimeline.reverse());

        // Scroll trigger for initial reveal
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2
        });
    });

    // Parallax effect for images
    teamCards.forEach(card => {
        const image = card.querySelector('.team-member-image');
        gsap.to(image, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Text reveal animations
    gsap.utils.toArray('.team-member-bio').forEach(bio => {
        gsap.from(bio, {
            scrollTrigger: {
                trigger: bio,
                start: "top bottom-=50",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });
    });
});