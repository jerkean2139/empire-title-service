<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php bloginfo('name'); ?> - <?php bloginfo('description'); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto">
        <h1 class="text-2xl font-bold"><?php bloginfo('name'); ?></h1>
        <p class="text-sm"><?php bloginfo('description'); ?></p>
    </div>
</header>
