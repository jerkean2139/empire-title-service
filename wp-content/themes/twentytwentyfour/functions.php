<?php
/**
 * Empire Title Service Theme Functions
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function empire_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true
    ));
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'empiretitle'),
        'footer'  => __('Footer Menu', 'empiretitle')
    ));
}
add_action('after_setup_theme', 'empire_theme_setup');

/**
 * Enqueue scripts and styles
 */
function empire_enqueue_assets() {
    // Enqueue Google Fonts
    wp_enqueue_style(
        'google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    // Enqueue main stylesheet
    wp_enqueue_style(
        'empire-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );

    // Enqueue modern header styles
    wp_enqueue_style(
        'modern-header-styles',
        get_template_directory_uri() . '/assets/css/header.css',
        array(),
        '1.0'
    );

    // Enqueue team styles
    wp_enqueue_style(
        'team-styles',
        get_template_directory_uri() . '/assets/css/team-styles.css',
        array(),
        '1.0'
    );

    // Enqueue home page styles
    wp_enqueue_style(
        'empire-home-styles',
        get_template_directory_uri() . '/assets/css/home.css',
        array(),
        '1.0'
    );

    // Enqueue custom styles
    wp_enqueue_style(
        'empire-custom-styles',
        get_template_directory_uri() . '/assets/css/custom.css',
        array(),
        '1.0'
    );

    // Enqueue additional styles
    wp_enqueue_style(
        'empire-header',
        get_template_directory_uri() . '/assets/css/header.css',
        array(),
        '1.0'
    );
    wp_enqueue_style(
        'empire-hero',
        get_template_directory_uri() . '/assets/css/hero.css',
        array(),
        '1.0'
    );
    wp_enqueue_style(
        'empire-services',
        get_template_directory_uri() . '/assets/css/services.css',
        array(),
        '1.0'
    );

    // Enqueue GSAP
    wp_enqueue_script(
        'gsap-core',
        'https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js',
        array(),
        '3.12',
        true
    );

    // Enqueue ScrollTrigger plugin
    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12/ScrollTrigger.min.js',
        array('gsap-core'),
        '3.12',
        true
    );

    // Enqueue GSAP ScrollTo plugin
    wp_enqueue_script(
        'gsap-scrollto',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js',
        array('gsap-core'),
        '3.12.2',
        true
    );

    // Enqueue modern header animations
    wp_enqueue_script(
        'modern-header-animations',
        get_template_directory_uri() . '/assets/js/header-animations.js',
        array('gsap-core'),
        '1.0',
        true
    );

    // Enqueue team animations
    wp_enqueue_script(
        'team-animations',
        get_template_directory_uri() . '/assets/js/team-animations.js',
        array('gsap-core', 'gsap-scrolltrigger'),
        '1.0',
        true
    );

    // Enqueue hero animations
    wp_enqueue_script(
        'empire-hero-animations',
        get_template_directory_uri() . '/assets/js/hero-animations.js',
        array('gsap-core'),
        '1.0',
        true
    );

    // Enqueue the new animation scripts
    wp_enqueue_script(
        'empire-service-animations',
        get_template_directory_uri() . '/assets/js/service-animations.js',
        array('gsap-core', 'gsap-scrolltrigger'),
        '1.0',
        true
    );
    wp_enqueue_script(
        'empire-responsive-menu',
        get_template_directory_uri() . '/assets/js/responsive-menu.js',
        array('gsap-core'),
        '1.0',
        true
    );

    // Enqueue enhanced animations
    wp_enqueue_script(
        'empire-enhanced-animations',
        get_template_directory_uri() . '/assets/js/enhanced-animations.js',
        array('gsap-core', 'gsap-scrolltrigger', 'gsap-scrollto'),
        '1.0',
        true
    );

    // Enqueue custom scripts
    wp_enqueue_script(
        'empire-custom-scripts',
        get_template_directory_uri() . '/assets/js/custom.js',
        array('gsap-core', 'gsap-scrolltrigger'),
        '1.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'empire_enqueue_assets');

/**
 * Register Custom Post Types
 */
function empire_register_post_types() {
    // Team Members Post Type
    register_post_type('team_member', array(
        'labels' => array(
            'name'               => __('Team Members', 'empiretitle'),
            'singular_name'      => __('Team Member', 'empiretitle'),
            'add_new'           => __('Add New', 'empiretitle'),
            'add_new_item'      => __('Add New Team Member', 'empiretitle'),
            'edit_item'         => __('Edit Team Member', 'empiretitle'),
            'new_item'          => __('New Team Member', 'empiretitle'),
            'view_item'         => __('View Team Member', 'empiretitle'),
            'search_items'      => __('Search Team Members', 'empiretitle'),
            'not_found'         => __('No team members found', 'empiretitle'),
            'not_found_in_trash'=> __('No team members found in Trash', 'empiretitle')
        ),
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-groups',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'team'),
    ));

    // Locations Post Type
    register_post_type('location', array(
        'labels' => array(
            'name'               => __('Locations', 'empiretitle'),
            'singular_name'      => __('Location', 'empiretitle'),
            'add_new'           => __('Add New', 'empiretitle'),
            'add_new_item'      => __('Add New Location', 'empiretitle'),
            'edit_item'         => __('Edit Location', 'empiretitle'),
            'new_item'          => __('New Location', 'empiretitle'),
            'view_item'         => __('View Location', 'empiretitle'),
            'search_items'      => __('Search Locations', 'empiretitle'),
            'not_found'         => __('No locations found', 'empiretitle'),
            'not_found_in_trash'=> __('No locations found in Trash', 'empiretitle')
        ),
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-location',
        'supports'     => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'locations'),
    ));
}
add_action('init', 'empire_register_post_types');

/**
 * Register ACF Fields
 */
function empire_register_acf_fields() {
    if(function_exists('acf_add_local_field_group')) {
        // Team Member Fields
        acf_add_local_field_group(array(
            'key' => 'group_team_member',
            'title' => 'Team Member Details',
            'fields' => array(
                array(
                    'key' => 'field_position',
                    'label' => 'Position',
                    'name' => 'position',
                    'type' => 'text',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_email',
                    'label' => 'Email',
                    'name' => 'email',
                    'type' => 'email',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_phone',
                    'label' => 'Phone',
                    'name' => 'phone',
                    'type' => 'text',
                    'required' => 0,
                )
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'team_member',
                    ),
                ),
            ),
            'position' => 'normal',
            'style' => 'default',
        ));

        // Location Fields
        acf_add_local_field_group(array(
            'key' => 'group_location',
            'title' => 'Location Details',
            'fields' => array(
                array(
                    'key' => 'field_address',
                    'label' => 'Address',
                    'name' => 'address',
                    'type' => 'text',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_phone_number',
                    'label' => 'Phone Number',
                    'name' => 'phone_number',
                    'type' => 'text',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_hours',
                    'label' => 'Business Hours',
                    'name' => 'hours',
                    'type' => 'textarea',
                    'required' => 0,
                )
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'location',
                    ),
                ),
            ),
            'position' => 'normal',
            'style' => 'default',
        ));
    }
}
add_action('acf/init', 'empire_register_acf_fields');

/**
 * Add custom image sizes
 */
function empire_add_image_sizes() {
    add_image_size('team-member-portrait', 400, 500, true);
    add_image_size('location-thumbnail', 600, 400, true);
}
add_action('after_setup_theme', 'empire_add_image_sizes');

/**
 * Disable Comments on Custom Post Types
 */
function empire_disable_comments_on_cpt($open, $post_id) {
    $post = get_post($post_id);
    if ($post->post_type == 'team_member' || $post->post_type == 'location') {
        return false;
    }
    return $open;
}
add_filter('comments_open', 'empire_disable_comments_on_cpt', 10, 2);

/**
 * Add custom body classes
 */
function empire_body_classes($classes) {
    if (is_page_template('page-team.php')) {
        $classes[] = 'team-page';
    }
    if (is_page_template('page-locations.php')) {
        $classes[] = 'locations-page';
    }
    return $classes;
}
add_filter('body_class', 'empire_body_classes');
