<?php
/**
 * Front Page Template
 */

get_header(); ?>

<div class="main-content">
    <?php 
    get_template_part('template-parts/hero');
    get_template_part('template-parts/services');
    ?>
</div>

<?php get_footer(); ?>