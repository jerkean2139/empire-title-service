<section id="team" class="team-section">
    <div class="team-container">
        <h2 class="section-title">Meet Our Team</h2>
        <p class="section-subtitle">Dedicated professionals committed to your success</p>
        
        <div class="team-grid">
            <!-- Team members will be loaded dynamically -->
            <?php
            $team_members = new WP_Query(array(
                'post_type' => 'team_member',
                'posts_per_page' => -1,
                'orderby' => 'menu_order',
                'order' => 'ASC'
            ));

            if ($team_members->have_posts()) :
                while ($team_members->have_posts()) : $team_members->the_post();
                ?>
                <div class="team-card">
                    <div class="team-image">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('team-member'); ?>
                        <?php endif; ?>
                    </div>
                    <div class="team-info">
                        <h3 class="team-name"><?php the_title(); ?></h3>
                        <?php if (get_field('position')) : ?>
                            <p class="team-position"><?php echo esc_html(get_field('position')); ?></p>
                        <?php endif; ?>
                        <div class="team-bio">
                            <?php the_excerpt(); ?>
                        </div>
                    </div>
                </div>
                <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>