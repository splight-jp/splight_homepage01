// =========================================================================
// A. DOMContentLoaded: HTMLの読み込み完了後に実行する処理
// =========================================================================
document.addEventListener('DOMContentLoaded', function() {

   // ---------------------------------------------------------------------
    // ① モバイルメニューの機能
    // ---------------------------------------------------------------------
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('is-open');

            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    if (mobileMenu && mobileMenuToggle) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('is-open'); // アイコンの状態もリセット
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ---------------------------------------------------------------------
    // ② ロゴの切り替え機能 (スクロールとホバー対応)
    // ---------------------------------------------------------------------
    const header = document.querySelector('.site-header');
    const logoImg = document.getElementById('logo-image');

    if (header && logoImg) {
        const colorLogoSrc = '/splight_homepage01/images/logo.png';
        const whiteLogoSrc = '/splight_homepage01/images/logo-white.png';
        let isHovering = false;

        function updateLogo() {
            const isScrolled = header.classList.contains('header-scrolled');
            // スクロールされているか、マウスが乗っている場合はカラーロゴ
            if (isScrolled || isHovering) {
                if (logoImg.src.includes('logo-white')) logoImg.src = colorLogoSrc;
            } else {
                // それ以外は白ロゴ
                if (logoImg.src.includes('logo.png')) logoImg.src = whiteLogoSrc;
            }
        }

        // マウスホバーの処理を再追加
        header.addEventListener('mouseenter', () => { isHovering = true; updateLogo(); });
        header.addEventListener('mouseleave', () => { isHovering = false; updateLogo(); });
        
        const logoObserver = new MutationObserver(updateLogo);
        logoObserver.observe(header, { attributes: true, attributeFilter: ['class'] });
        updateLogo();
    }
    
    // ---------------------------------------------------------------------
    // ③ スムーズスクロール機能（ページ内リンク用）
    // ---------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // リンク先が '#' だけでないことを確認
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ---------------------------------------------------------------------
    // ④ 表示されたらアニメーションを開始する機能（index.html用）
    // ---------------------------------------------------------------------
    const animateElements = document.querySelectorAll('.business-card, .stat-item, .news-item');
    if (animateElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // ---------------------------------------------------------------------
    // ⑤ 数字のカウンターアニメーション機能（index.html用）
    // ---------------------------------------------------------------------
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-item h3');
                    counters.forEach(counter => {
                        const target = parseInt(counter.textContent);
                        if (!isNaN(target)) {
                            animateCounter(counter, target);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
    
    // ---------------------------------------------------------------------
    // ⑥ ビデオ関連の機能（index.html用）
    // ---------------------------------------------------------------------
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(error => console.log('Video autoplay failed:', error));
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play().catch(error => console.log('Video resume failed:', error));
            }
        });
    }
    
    // ---------------------------------------------------------------------
    // ⑦ Agrivoltaicsページ専用のグラフ描画機能
    // ---------------------------------------------------------------------
    const ctx = document.getElementById('installationChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['藤棚型', 'ビニールハウス型', '追尾型', '垂直型'],
                datasets: [{
                    label: '設置実績（件数）',
                    data: [80, 60, 40, 20],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)', 'rgba(33, 150, 243, 0.8)',
                        'rgba(255, 152, 0, 0.8)', 'rgba(156, 39, 176, 0.8)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)', 'rgba(33, 150, 243, 1)',
                        'rgba(255, 152, 0, 1)', 'rgba(156, 39, 176, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

}); // <<<< DOMContentLoadedはここで終了

// =========================================================================
// B. ページ全体で常に有効な機能
// =========================================================================

// ---------------------------------------------------------------------
// ① ヘッダーの背景色をスクロールで変更する機能
// ---------------------------------------------------------------------
window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (header) {
        // JSではクラスを付け外しするだけに変更
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
});

// ---------------------------------------------------------------------
// ② 数字をアニメーションさせるための関数
// ---------------------------------------------------------------------
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    updateCounter();
}

// ---------------------------------------------------------------------
// ③ スクロールトップボタンの作成と表示制御
// ---------------------------------------------------------------------
// ボタンがまだ作られていない場合のみ作成する
if (!document.querySelector('.scroll-to-top')) {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        width: 50px; height: 50px; border-radius: 50%;
        background-color: #F5A623; color: white; border: none;
        font-size: 20px; cursor: pointer; opacity: 0;
        transition: opacity 0.3s ease; z-index: 1000; visibility: hidden;
    `;
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}
