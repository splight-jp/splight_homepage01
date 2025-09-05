// サイドバーのスムーズスクロール
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // アクティブリンクの更新
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// スクロール時のサイドバーアクティブリンク更新とヘッダー制御
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    const header = document.querySelector('.site-header');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // ヘッダーの表示/非表示制御
    if (currentScrollTop > 100) { // 100px以上スクロールした場合
        if (currentScrollTop > lastScrollTop) {
            // 下にスクロール - ヘッダーを隠す
            header.classList.add('header-hidden');
        } else {
            // 上にスクロール - ヘッダーを表示
            header.classList.remove('header-hidden');
        }
    } else {
        // トップ付近 - ヘッダーを表示
        header.classList.remove('header-hidden');
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    
    // サイドバーアクティブリンク更新
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// アコーディオン機能
function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const toggle = header.querySelector('.accordion-toggle');
    
    item.classList.toggle('active');
    
    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        toggle.textContent = '−';
    } else {
        content.style.maxHeight = '0';
        toggle.textContent = '+';
    }
}

// チャート描画
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('installationChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['藤棚型', 'ハウス型', '追尾型', '垂直型'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39',
                    '#FFC107'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            family: 'Noto Sans JP'
                        }
                    }
                }
            }
        }
    });
});

// モバイルメニュー
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.mobile-menu').classList.toggle('active');
});

