document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuContainer = document.querySelector('.menu-container');
    let lastScroll = 0;

    // Header scroll animation
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
            // Hide header
            gsap.to(header, {
                y: -100,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
            // Show header
            gsap.to(header, {
                y: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (menuToggle && menuContainer) {
        menuToggle.addEventListener('click', () => {
            menuContainer.classList.toggle('active');
            
            // Animate menu items
            const menuItems = menuContainer.querySelectorAll('.nav-menu > li');
            
            if (menuContainer.classList.contains('active')) {
                gsap.from(menuItems, {
                    y: 30,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Initial header animation
    gsap.from(header, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});