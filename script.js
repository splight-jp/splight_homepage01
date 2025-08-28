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

            // ハンバーガーメニューアイコンのアニメーション
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

    // モバイルメニューのリンククリック時にメニューを閉じる
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ---------------------------------------------------------------------
    // ② ロゴの切り替え機能
    // ---------------------------------------------------------------------
    const header = document.querySelector('.site-header');
    const logoImg = document.getElementById('logo-image');

    if (header && logoImg) {
    const colorLogoSrc = '/splight_homepage01/images/logo.png';
    const whiteLogoSrc = '/splight_homepage01/images/logo-white.png';

    function updateLogo() {
        // スクロール状態だけをチェックする
        const isScrolled = header.classList.contains('header-scrolled');
        if (isScrolled) {
            // スクロール時 → カラーロゴ
            if (logoImg.src !== colorLogoSrc) logoImg.src = colorLogoSrc;
        } else {
            // トップ（透明）時 → 白ロゴ
            if (logoImg.src !== whiteLogoSrc) logoImg.src = whiteLogoSrc;
        }
    }

    // スクロールによるクラス変化のみを監視
    const logoObserver = new MutationObserver(updateLogo);
    logoObserver.observe(header, { attributes: true, attributeFilter: ['class'] });

    // 初期表示
    updateLogo();
}
    
    // ---------------------------------------------------------------------
    // ③ スムーズスクロール機能
    // ---------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ---------------------------------------------------------------------
    // ④ 表示されたらアニメーションを開始する機能
    // ---------------------------------------------------------------------
    const animateElements = document.querySelectorAll('.business-card, .stat-item, .news-item');
    if (animateElements.length > 0) {
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animationObserver.unobserve(entry.target);
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
    // ⑤ 数字のカウンターアニメーション機能
    // ---------------------------------------------------------------------
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-item h3');
                    counters.forEach(counter => {
                        const target = parseInt(counter.textContent);
                        animateCounter(counter, target);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ---------------------------------------------------------------------
    // ⑥ スクロールトップボタンの作成
    // ---------------------------------------------------------------------
    createScrollToTopButton();

    // ---------------------------------------------------------------------
    // ⑦ ビデオ関連の機能
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

}); // <<<< DOMContentLoadedはここで終了

// =========================================================================
// B. ヘルパー関数と、DOMContentLoaded外で実行する処理
// =========================================================================

// ---------------------------------------------------------------------
// ① ヘッダーの背景色をスクロールで変更する機能
// ---------------------------------------------------------------------
window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.classList.add('header-scrolled');
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.boxShadow = 'none';
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
// ③ スクロールトップボタンを作成し、動作させる関数
// ---------------------------------------------------------------------
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        width: 50px; height: 50px; border-radius: 50%;
        background-color: #F5A623; color: white; border: none;
        font-size: 20px; cursor: pointer; opacity: 0;
        transition: opacity 0.3s ease; z-index: 1000;
    `;
    button.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });
    document.body.appendChild(button);
}

// ---------------------------------------------------------------------
// ④ ヒーローセクションのパララックス（視差効果）
// ※この機能は削除されたようなのでコメントアウトします。もし必要であれば下の行の/*と*/を削除してください。
/*
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});
*/
