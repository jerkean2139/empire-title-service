<?php
/*
Plugin Name: Empire Title Calculators
Description: A plugin providing calculators for Seller Net Sheet, Mortgage Pre-Qualifying, and Quick Quote
Version: 1.0
Author: Empire Title
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue necessary scripts and styles
function etc_enqueue_scripts() {
    wp_enqueue_style('etc-styles', plugins_url('assets/css/style.css', __FILE__));
    wp_enqueue_script('etc-scripts', plugins_url('assets/js/calculators.js', __FILE__), array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'etc_enqueue_scripts');

// Include calculator files
require_once plugin_dir_path(__FILE__) . 'includes/seller-net-sheet.php';
require_once plugin_dir_path(__FILE__) . 'includes/mortgage-pre-qualifier.php';
require_once plugin_dir_path(__FILE__) . 'includes/quick-quote.php';
