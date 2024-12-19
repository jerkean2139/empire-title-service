<?php
/**
 * Template Name: Team Page
 */

get_header(); ?>

<main id="primary" class="site-main">
    <header class="team-page-header">
        <div class="container">
            <h1 class="team-page-title"><?php the_title(); ?></h1>
        </div>
    </header>

    <div class="team-section">
        <div class="container">
            <div class="team-grid">
                <?php
                $team_members = new WP_Query(array(
                    'post_type' => 'team_member',
                    'posts_per_page' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC'
                ));

                if ($team_members->have_posts()) :
                    while ($team_members->have_posts()) : $team_members->the_post(); ?>
                        <article class="team-member-card">
                            <div class="team-member-image-container">
                                <?php if (has_post_thumbnail()) :
                                    the_post_thumbnail('team-member-thumbnail', array('class' => 'team-member-image'));
                                endif; ?>
                            </div>
                            <div class="team-member-content">
                                <h2 class="team-member-name"><?php the_title(); ?></h2>
                                <?php if (get_field('position')) : ?>
                                    <div class="team-member-position"><?php echo esc_html(get_field('position')); ?></div>
                                <?php endif; ?>
                                <div class="team-member-bio">
                                    <?php the_excerpt(); ?>
                                </div>
                                <div class="team-member-contact">
                                    <?php if (get_field('email')) : ?>
                                        <a href="mailto:<?php echo esc_attr(get_field('email')); ?>" class="team-member-email">
                                            <?php echo esc_html(get_field('email')); ?>
                                        </a>
                                    <?php endif; ?>
                                    <?php if (get_field('phone')) : ?>
                                        <div class="team-member-phone">
                                            <?php echo esc_html(get_field('phone')); ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </article>
                    <?php endwhile;
                    wp_reset_postdata();
                else : ?>
                    <div class="no-team-members">
                        <p><?php esc_html_e('No team members found.', 'twentytwentyfour'); ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>