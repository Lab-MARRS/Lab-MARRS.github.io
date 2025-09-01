// 页面导航功能和交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航相关元素
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // 页面切换功能
    function showPage(targetPageId) {
        // 隐藏所有页面
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // 更新导航链接的激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 激活当前页面对应的导航链接
        const activeLink = document.querySelector(`[data-page="${targetPageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // 移动端：关闭汉堡菜单
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
        
        // 滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 为每个导航链接添加点击事件监听器
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // 更新浏览器URL（不刷新页面）
            history.pushState(null, '', `#${targetPage}`);
        });
    });

    // 汉堡菜单切换功能（移动端）
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const targetPage = hash || 'lab'; // 默认显示lab页面
        showPage(targetPage);
    });

    // 页面加载时根据URL hash显示对应页面
    function initializePage() {
        const hash = window.location.hash.substring(1);
        const targetPage = hash || 'lab'; // 默认显示lab页面
        showPage(targetPage);
    }

    // 初始化页面
    initializePage();

    // 添加平滑滚动效果到页面内的锚点链接
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 如果是页面导航链接，已经在上面处理了
            if (this.classList.contains('nav-link')) {
                return;
            }
            
            // 处理页面内的锚点链接
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 添加页面滚动时的导航栏效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动时添加阴影效果
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // 为卡片添加悬停效果增强
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.news-item, .member-card, .research-item, .project-item, .news-item-full');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // 延迟添加悬停效果，确保页面完全加载
    setTimeout(addCardHoverEffects, 100);

    // 添加页面切换时的淡入动画
    function addPageTransitionEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // 为所有主要内容元素添加观察器
        const elementsToAnimate = document.querySelectorAll('.lab-intro, .latest-news, .news-list, .leader-profile, .contact-section, .members-grid, .research-list, .project-list');
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // 添加页面过渡效果
    addPageTransitionEffects();

    // 添加外部链接的新窗口打开功能
    function handleExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
        
        externalLinks.forEach(link => {
            // 为mailto链接添加特殊处理
            if (link.href.startsWith('mailto:')) {
                link.addEventListener('click', function(e) {
                    // 让邮件链接正常工作
                    return true;
                });
            } else {
                // 为外部链接添加新窗口打开
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // 处理外部链接
    handleExternalLinks();

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        // 使用数字键1-6快速切换页面
        const keyMap = {
            '1': 'lab',
            '2': 'news', 
            '3': 'leader',
            '4': 'member',
            '5': 'research',
            '6': 'project'
        };
        
        if (keyMap[e.key]) {
            showPage(keyMap[e.key]);
            history.pushState(null, '', `#${keyMap[e.key]}`);
        }
        
        // ESC键关闭移动端菜单
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // 添加页面可见性API支持，当页面重新获得焦点时刷新动画
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // 页面重新可见时，重新触发动画
            const currentPage = document.querySelector('.page.active');
            if (currentPage) {
                currentPage.style.animation = 'none';
                setTimeout(() => {
                    currentPage.style.animation = 'fadeIn 0.5s ease-in-out';
                }, 10);
            }
        }
    });

    // 添加触摸手势支持（移动端滑动切换页面）
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleSwipe() {
        const swipeThreshold = 100; // 最小滑动距离
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            const currentPageId = document.querySelector('.page.active').id;
            const pageOrder = ['lab', 'news', 'leader', 'member', 'research', 'project'];
            const currentIndex = pageOrder.indexOf(currentPageId);
            
            let newIndex;
            if (swipeDistance > 0 && currentIndex > 0) {
                // 向右滑动，显示前一个页面
                newIndex = currentIndex - 1;
            } else if (swipeDistance < 0 && currentIndex < pageOrder.length - 1) {
                // 向左滑动，显示后一个页面
                newIndex = currentIndex + 1;
            }
            
            if (newIndex !== undefined) {
                showPage(pageOrder[newIndex]);
                history.pushState(null, '', `#${pageOrder[newIndex]}`);
            }
        }
    }
    
    // 添加触摸事件监听器
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // 控制台输出欢迎信息（开发者彩蛋）
    console.log('%c欢迎访问我们的研究实验室网站！', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c如果您对我们的研究感兴趣，欢迎联系我们！', 'color: #4a5568; font-size: 14px;');
    
    // 添加页面加载完成的提示
    console.log('%c页面已完全加载，所有交互功能已启用', 'color: #48bb78; font-size: 12px;');
});

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
