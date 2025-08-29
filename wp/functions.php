// カスタム投稿タイプ作成
function create_splight_post_types() {
    // お知らせ投稿タイプ
    register_post_type('news',
        array(
            'labels' => array(
                'name' => 'お知らせ',
                'singular_name' => 'お知らせ'
            ),
            'public' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'taxonomies' => array('news_category')
        )
    );
    
    // 資材販売投稿タイプ
    register_post_type('materials',
        array(
            'labels' => array(
                'name' => '資材販売',
                'singular_name' => '資材'
            ),
            'public' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'taxonomies' => array('material_category')
        )
    );
}
add_action('init', 'create_splight_post_types');

// カスタムタクソノミー作成
function create_splight_taxonomies() {
    // お知らせカテゴリ
    register_taxonomy('news_category', 'news', array(
        'labels' => array('name' => 'ニュースカテゴリ'),
        'show_in_rest' => true,
        'hierarchical' => true
    ));
    
    // 資材カテゴリ
    register_taxonomy('material_category', 'materials', array(
        'labels' => array('name' => '資材カテゴリ'),
        'show_in_rest' => true,
        'hierarchical' => true
    ));
}
add_action('init', 'create_splight_taxonomies');
