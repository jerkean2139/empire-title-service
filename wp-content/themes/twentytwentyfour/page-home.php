<?php
/**
 * Template Name: Home Page
 */

get_header(); ?>

<main id="primary" class="site-main">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Trusted Title Services for Your Peace of Mind</h1>
                <p class="hero-subtitle">Professional title and settlement services in Indiana, backed by years of expertise and commitment to excellence.</p>
                <div class="hero-buttons">
                    <a href="/contact" class="btn btn-primary">Get Started</a>
                    <a href="/about" class="btn btn-secondary">Learn More</a>
                </div>
            </div>
            <div class="hero-image">
                <!-- Add dynamic hero image -->
                <?php if (has_post_thumbnail()) : ?>
                    <?php the_post_thumbnail('full', array('class' => 'hero-img')); ?>
                <?php else : ?>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/home-hero.jpg" alt="Empire Title Service" class="hero-img">
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
        <div class="container">
            <div class="section-header">
                <h2>Our Services</h2>
                <p>Comprehensive title solutions for every need</p>
            </div>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <h3>Title Insurance</h3>
                    <p>Protect your property investment with comprehensive title insurance coverage.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <!-- Default icon -->
                        📋
                    </div>
                    <h3>Settlement Services</h3>
                    <p>Smooth, efficient closing processes handled by experienced professionals.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <!-- Default icon -->
                        🔍
                    </div>
                    <h3>Title Search</h3>
                    <p>Thorough examination of property records to ensure clear ownership.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="features-grid">
                <div class="feature-content">
                    <h2>Why Choose Empire Title?</h2>
                    <ul class="feature-list">
                        <li>
                            <span class="feature-icon">✓</span>
                            <div class="feature-text">
                                <h3>Experience</h3>
                                <p>Over 20 years of industry expertise</p>
                            </div>
                        </li>
                        <li>
                            <span class="feature-icon">✓</span>
                            <div class="feature-text">
                                <h3>Local Knowledge</h3>
                                <p>Deep understanding of Indiana real estate</p>
                            </div>
                        </li>
                        <li>
                            <span class="feature-icon">✓</span>
                            <div class="feature-text">
                                <h3>Customer Service</h3>
                                <p>Dedicated support throughout the process</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="feature-image">
                    <!-- Replace with your actual image -->
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/feature-image.jpg" alt="Our Features">
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Get Started?</h2>
                <p>Contact us today for a consultation</p>
                <a href="/contact" class="btn btn-primary">Contact Us</a>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
