<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <header class="site-header">
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between items-center h-20">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <?php if (has_custom_logo()) : ?>
                            <?php the_custom_logo(); ?>
                        <?php else : ?>
                            <a href="<?php echo esc_url(home_url('/')); ?>" class="text-2xl font-bold text-gray-800">
                                <?php bloginfo('name'); ?>
                            </a>
                        <?php endif; ?>
                    </div>

                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" class="md:hidden flex items-center p-2">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>

                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div id="mobile-menu" class="hidden md:hidden pb-4">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_class' => 'mobile-menu',
                        'container' => false,
                        'menu_id' => 'mobile-menu-items',
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>
            </div>
        </nav>
    </header>