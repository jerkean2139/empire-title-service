<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="header-container">
        <div class="logo-container">
            <a href="<?php echo home_url(); ?>">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo/logo.png" alt="Empire Title" width="150">
            </a>
        </div>

        <nav class="main-navigation">
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#calculator">Calculator</a></li>
                <li><a href="#team">Our Team</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
                <li class="login-button"><a href="/login">Login</a></li>
            </ul>
        </nav>
    </div>
</header>