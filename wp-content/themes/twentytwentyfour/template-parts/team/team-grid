<?php
/**
 * Template Name: Team Grid
 * 
 * This template displays all team members in a grid layout
 */

get_header(); ?>

<div class="team-grid-container max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-12"><?php the_title(); ?></h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php
        $team_members = new WP_Query(array(
            'post_type' => 'team_member',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC'
        ));

        if ($team_members->have_posts()) :
            while ($team_members->have_posts()) : $team_members->the_post();
                get_template_part('template-parts/team/team-card');
            endwhile;
            wp_reset_postdata();
        else : ?>
            <p class="text-center col-span-full">No team members found.</p>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>