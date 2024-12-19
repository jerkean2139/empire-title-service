<?php
// Enqueue styles and scripts
function empire_title_enqueue_styles() {
    // Enqueue Tailwind CSS
    wp_enqueue_style('tailwind', 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

    // Enqueue custom theme JavaScript
    wp_enqueue_script('theme-scripts', get_template_directory_uri() . '/assets/js/theme.js', [], null, true);
}
add_action('wp_enqueue_scripts', 'empire_title_enqueue_styles');
?>
