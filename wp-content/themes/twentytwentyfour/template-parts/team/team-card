<?php
/**
 * Template part for displaying team member cards
 */
?>

<div class="team-card bg-white rounded-lg shadow-lg overflow-hidden">
    <?php if (has_post_thumbnail()) : ?>
        <div class="aspect-w-1 aspect-h-1">
            <?php the_post_thumbnail('full', array('class' => 'w-full h-full object-cover')); ?>
        </div>
    <?php endif; ?>
    
    <div class="p-6">
        <h3 class="text-xl font-bold mb-2"><?php the_title(); ?></h3>
        
        <?php if (get_field('position')) : ?>
            <p class="text-gray-600 mb-4"><?php echo esc_html(get_field('position')); ?></p>
        <?php endif; ?>
        
        <div class="text-gray-700 mb-4">
            <?php the_excerpt(); ?>
        </div>
        
        <?php if (get_field('email')) : ?>
            <a href="mailto:<?php echo esc_attr(get_field('email')); ?>" 
               class="text-blue-600 hover:text-blue-800">
                <?php echo esc_html(get_field('email')); ?>
            </a>
        <?php endif; ?>
    </div>
</div>