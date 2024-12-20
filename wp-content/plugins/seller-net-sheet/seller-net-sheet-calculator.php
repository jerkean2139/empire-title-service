<?php
/*
Plugin Name: Seller Net Sheet Calculator
Description: A calculator for Seller Net Sheet.
Version: 1.0
Author: Jeremy Kean-Kean On Biz
*/

function snsc_enqueue_assets() {
    wp_enqueue_style('snsc-styles', plugins_url('assets/styles.css', __FILE__));
    wp_enqueue_script('jquery');
    wp_enqueue_script('snsc-scripts', plugins_url('assets/scripts.js', __FILE__), ['jquery'], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'snsc_enqueue_assets');


function snsc_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/calculator-form.php';
    return ob_get_clean();
}
add_shortcode('seller_net_sheet', 'snsc_shortcode');

function load_jspdf_library() {
    wp_enqueue_script('jspdf', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js', [], '2.4.0', true);
}
add_action('wp_enqueue_scripts', 'load_jspdf_library');
