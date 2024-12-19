document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
        <span class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </span>
    `;

    const nav = document.querySelector('.main-navigation');
    header.insertBefore(menuToggle, nav);

    // Create mobile menu timeline
    const menuTimeline = gsap.timeline({ paused: true });
    
    menuTimeline
        .to(nav, {
            clipPath: 'circle(100% at 50% 50%)',
            duration: 0.5,
            ease: 'power2.inOut'
        })
        .from('.nav-menu li', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.3
        }, '-=0.3');

    // Toggle menu functionality
    let isOpen = false;
    menuToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        menuToggle.classList.toggle('is-active');
        document.body.classList.toggle('menu-open');
        
        if (isOpen) {
            menuTimeline.play();
        } else {
            menuTimeline.reverse();
        }
    });

    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 15px;
            z-index: 1000;
        }

        .hamburger {
            display: block;
            position: relative;
            width: 24px;
            height: 20px;
        }

        .hamburger-line {
            display: block;
            width: 24px;
            height: 2px;
            background: white;
            position: absolute;
            left: 0;
            transition: transform 0.3s ease;
        }

        .hamburger-line:nth-child(1) { top: 0; }
        .hamburger-line:nth-child(2) { top: 50%; transform: translateY(-50%); }
        .hamburger-line:nth-child(3) { bottom: 0; }

        .menu-toggle.is-active .hamburger-line:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }

        .menu-toggle.is-active .hamburger-line:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.is-active .hamburger-line:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }

        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }

            .main-navigation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: rgba(20, 20, 20, 0.98);
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle(0% at 100% 0);
                pointer-events: none;
            }

            .menu-open .main-navigation {
                pointer-events: auto;
            }

            .nav-menu {
                flex-direction: column;
                align-items: center;
                gap: 2rem;
            }

            .nav-menu a {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
});