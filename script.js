// Edge浏览器兼容性检测和修复
function detectAndFixEdgeCompatibility() {
    const isEdge = navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Edg') !== -1;
    
    if (isEdge) {
        console.log('检测到Microsoft Edge浏览器，启用兼容性修复...');
        
        // 为body添加Edge标识类，让CSS能够应用特定样式
        document.body.classList.add('edge-fallback');
        
        // 检测Edge版本类型
        const isEdgeLegacy = navigator.userAgent.indexOf('Edge/') !== -1;
        const isEdgeChromium = navigator.userAgent.indexOf('Edg/') !== -1;
        
        if (isEdgeLegacy) {
            document.body.classList.add('edge-legacy');
            console.log('检测到Edge Legacy (EdgeHTML)');
        } else if (isEdgeChromium) {
            document.body.classList.add('edge-chromium');
            console.log('检测到Edge Chromium');
        }
        
        // 修复CSS Grid在旧版Edge中的问题
        const researchItems = document.querySelectorAll('.research-item');
        researchItems.forEach(function(item) {
            // 为Edge添加特殊的grid布局处理
            item.style.display = '-ms-grid';
            item.style.msGridColumns = '400px 1fr';
            item.style.msGridRows = 'auto';
        });
        
        // 修复transition动画问题
        const publications = document.querySelectorAll('.research-publications');
        publications.forEach(function(pub) {
            pub.style.msTransition = 'max-height 0.5s ease, opacity 0.3s ease';
        });
        
        // 修复轮播图透明度问题
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach(function(slide) {
            slide.style.msFilter = 'alpha(opacity=0)';
        });
        
        const activeSlides = document.querySelectorAll('.carousel-slide.active');
        activeSlides.forEach(function(slide) {
            slide.style.msFilter = 'alpha(opacity=100)';
        });
        
        // 添加调试标识（开发时可启用）
        // document.body.classList.add('show-edge-debug');
        
        console.log('Edge兼容性修复已应用');
    }
}

// 页面导航功能和交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 首先执行Edge兼容性检测
    detectAndFixEdgeCompatibility();
    // 获取导航相关元素
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const pageContentSelector = '.lab-intro, .latest-news, .news-list, .leader-profile, .contact-section, .members-grid, .research-list, .project-list';

    // Hidden pages are not intersecting during the initial load. Some browsers do
    // not re-run the observer when those pages are later displayed, so always
    // restore the selected page's content before showing it.
    function revealPageContent(page) {
        if (!page) return;

        page.querySelectorAll(pageContentSelector).forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

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
            revealPageContent(targetPage);
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
        if (!('IntersectionObserver' in window)) {
            return;
        }

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
        const elementsToAnimate = document.querySelectorAll(pageContentSelector);
        
        elementsToAnimate.forEach(el => {
            // Do not make content inside an initially hidden page transparent.
            // It will be revealed by showPage() when the user navigates to it.
            const parentPage = el.closest('.page');
            if (parentPage && !parentPage.classList.contains('active')) {
                return;
            }

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
    
    // 初始化轮播图
    initializeCarousel();

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        // 使用数字键1-6快速切换页面
        const keyMap = {
            '1': 'lab',
            '2': 'news', 
            '3': 'member',
            '4': 'research',
            '5': 'project'
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
            const pageOrder = ['lab', 'news', 'member', 'research', 'project'];
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

    // 成员页面图像优化处理
    function optimizeMemberImages() {
        const memberCards = document.querySelectorAll('.member-card');
        
        memberCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                // 图像加载错误处理
                img.onerror = function() {
                    this.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'member-placeholder';
                    placeholder.innerHTML = `
                        <div style="
                            height: 280px;
                            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 4rem;
                            color: #a0aec0;
                        ">👤</div>
                    `;
                    this.parentNode.insertBefore(placeholder, this);
                };
                
                // 图像加载成功后的智能处理
                img.onload = function() {
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    
                    // 根据图像宽高比智能选择显示模式
                    if (aspectRatio < 0.75) {
                        // 竖长图像（全身照等）- 使用contain模式显示完整图像
                        card.classList.add('fit-contain');
                        console.log('检测到竖长图像，使用完整显示模式');
                    } else if (aspectRatio > 1.5) {
                        // 横长图像 - 使用cover模式并居中
                        card.classList.add('fit-cover', 'pos-center');
                        console.log('检测到横长图像，使用填充模式');
                    } else {
                        // 正常比例图像 - 使用cover模式并居中
                        card.classList.add('fit-cover', 'pos-center');
                        console.log('检测到正常比例图像，使用填充居中模式');
                    }
                    
                    // 平滑显示
                    this.style.opacity = '0';
                    this.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        this.style.opacity = '1';
                    }, 100);
                };
                
                // 确保图像正确显示
                if (img.complete && img.naturalHeight !== 0) {
                    img.onload();
                }
            }
        });
    }

    // 手动调整成员图像显示模式的函数
    function adjustMemberImageDisplay(cardIndex, mode) {
        const memberCards = document.querySelectorAll('.member-card');
        if (cardIndex >= 0 && cardIndex < memberCards.length) {
            const card = memberCards[cardIndex];
            
            // 清除现有的显示模式类
            card.classList.remove('fit-contain', 'fit-cover', 'pos-top', 'pos-center', 'pos-bottom', 'full-body');
            
            // 应用新的显示模式
            switch(mode) {
                case 'contain':
                    card.classList.add('fit-contain');
                    break;
                case 'cover-top':
                    card.classList.add('fit-cover', 'pos-top');
                    break;
                case 'cover-center':
                    card.classList.add('fit-cover', 'pos-center');
                    break;
                case 'cover-bottom':
                    card.classList.add('fit-cover', 'pos-bottom');
                    break;
                case 'full-body':
                    card.classList.add('full-body');
                    break;
                default:
                    card.classList.add('fit-cover', 'pos-center');
            }
            
            console.log(`成员卡片 ${cardIndex} 显示模式已调整为: ${mode}`);
        }
    }

    // 在控制台提供调整函数供开发者使用
    window.adjustMemberImage = adjustMemberImageDisplay;

    // 成员卡片高度均衡处理
    function balanceMemberCardHeights() {
        const memberCards = document.querySelectorAll('.member-card');
        let maxHeight = 0;
        
        // 重置高度
        memberCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // 计算最大高度
        memberCards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // 应用统一高度（仅在桌面端）
        if (window.innerWidth > 768) {
            memberCards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }

    // 初始化成员页面优化
    setTimeout(() => {
        optimizeMemberImages();
        balanceMemberCardHeights();
    }, 500);

    // 窗口大小改变时重新平衡高度
    window.addEventListener('resize', debounce(() => {
        balanceMemberCardHeights();
    }, 300));

    // 强制图像清晰度优化 - 简化但更有效的方法
    function forceImageClarity() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach((img, index) => {
            // 强制应用关键的清晰度设置
            img.style.imageRendering = '-webkit-optimize-contrast';
            img.style.imageRendering = 'crisp-edges';
            img.style.msInterpolationMode = 'bicubic';
            img.style.transform = 'translateZ(0)';
            img.style.webkitTransform = 'translateZ(0)';
            img.style.willChange = 'transform';
            img.style.webkitBackfaceVisibility = 'hidden';
            img.style.backfaceVisibility = 'hidden';
            
            // 添加强制清晰类
            img.classList.add('force-crisp');
            
            // 检查是否在问题页面
            const parentCard = img.closest('.news-item, .research-item, .project-item, .leader-profile, .lab-intro');
            if (parentCard) {
                // 对这些页面应用更强的优化
                img.style.imageRendering = '-webkit-optimize-contrast !important';
                console.log(`图像 ${index + 1} 清晰度已强制优化`);
            }
        });
    }

    // 检测并修复模糊图像
    function fixBlurryImages() {
        const problematicSelectors = [
            '.news-item img',
            '.research-item img', 
            '.project-item img',
            '.leader-image img',
            '.lab-image img'
        ];
        
        problematicSelectors.forEach(selector => {
            const images = document.querySelectorAll(selector);
            images.forEach(img => {
                // 强制重置图像渲染
                img.style.imageRendering = 'auto';
                setTimeout(() => {
                    img.style.imageRendering = '-webkit-optimize-contrast';
                    img.style.imageRendering = 'crisp-edges';
                    img.style.transform = 'translateZ(0)';
                }, 10);
            });
        });
        
        console.log('所有问题图像已重新优化');
    }

    // 图像质量检测和警告
    function checkImageQuality() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                const displayWidth = img.offsetWidth;
                const displayHeight = img.offsetHeight;
                
                // 检查图像是否被过度缩放
                const scaleRatio = Math.max(displayWidth / naturalWidth, displayHeight / naturalHeight);
                
                if (scaleRatio > 1.5) {
                    console.warn(`图像 ${index + 1} 可能因为放大过度而显示模糊。原始尺寸: ${naturalWidth}x${naturalHeight}, 显示尺寸: ${displayWidth}x${displayHeight}`);
                    console.log(`建议使用至少 ${Math.ceil(displayWidth * 1.5)}x${Math.ceil(displayHeight * 1.5)} 的图像以获得最佳清晰度`);
                }
                
                // 检查图像是否太小
                if (naturalWidth < displayWidth || naturalHeight < displayHeight) {
                    console.warn(`图像 ${index + 1} 分辨率可能不足，建议使用更高分辨率的图像`);
                }
            }
        });
    }

    // 实时图像质量监控
    function monitorImageQuality() {
        // 使用 ResizeObserver 监控图像尺寸变化
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const img = entry.target;
                    if (img.tagName === 'IMG') {
                        applyImageOptimizations(img);
                    }
                });
            });
            
            document.querySelectorAll('img').forEach(img => {
                resizeObserver.observe(img);
            });
        }
    }

    // 初始化图像优化 - 使用更直接的方法
    setTimeout(() => {
        forceImageClarity();
        fixBlurryImages();
        checkImageQuality();
    }, 500);
    
    // 页面完全加载后再次优化
    window.addEventListener('load', () => {
        setTimeout(() => {
            forceImageClarity();
            fixBlurryImages();
        }, 1000);
    });

    // 页面可见性变化时重新优化
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => {
                forceImageClarity();
                fixBlurryImages();
            }, 100);
        }
    });
    
    // 提供手动修复功能
    window.fixImageClarity = function() {
        forceImageClarity();
        fixBlurryImages();
        console.log('手动图像清晰度修复已完成');
    };

    // 控制台输出欢迎信息（开发者彩蛋）
    console.log('%c欢迎访问我们的研究实验室网站！', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c如果您对我们的研究感兴趣，欢迎联系我们！', 'color: #4a5568; font-size: 14px;');
    
    // 添加页面加载完成的提示
    console.log('%c页面已完全加载，所有交互功能已启用', 'color: #48bb78; font-size: 12px;');
});

// 成员弹窗功能
const memberData = {
    'zheng-xu': {

        introImage: 'Figure/xu_intro.png',
        description1: `Dr. Zheng Xu has been selected for the 2025 “Rising Stars in Transportation” Young Investigator Advancement Program. The program is open globally to candidates from universities, industry, and research institutes, and annually selects 35 outstanding transportation scholars under the age of 35. It identifies young researchers who drive disruptive, original scientific and technological innovation and address critical, foundational technical challenges in transportation, with the aim of fostering the sustainable development of early-career research talent.`,
        description2: `Dr. Xu’s research employs a human-centric approach to optimize the operational efficiency of Autonomous Driving Systems (ADS). It primarily addresses the gap between technological advancements and human acceptance in high-level autonomous driving. The main academic contributions include: 1) A method for deconstructing autonomous driving scenarios focused on richness, transparency, and rarity; 2) A systematic approach to quantify ADS risk scenarios integrating rider behavior; 3) A strategy for optimizing human ADS collaborative decision-making.
Dr. Xu has conducted high-impact research and published 12 first-author papers in leading transportation journals, including Transportation Research Part C, Transportation Research Part D, and Accident Analysis & Prevention, with an average annual citation rate of approximately 25 citations per paper. He has also received five international research awards, including the Monash Postgraduate Publications Award, the Third Prize in the 2021 IEEE “Shape the Future of ITS” Competition, etc., with acceptance rates ranging from 5% to 30%. 
Dr. Xu is currently the principal investigator of a State Key Laboratory project focusing on Human-ADS Collaboration in HGVs; serves on the Early-Career Editorial Board of Transportation Environment and Safety (Oxford University Press); and is an active reviewer for 15 internationally recognized journals, including TR_D, TR_F, AAP, IEEE-T-ITS, IEEE-T-IV, etc., with more than 150 reviews completed to date. `
    }
};

// 打开成员弹窗
function openMemberModal(memberId) {
    const modal = document.getElementById('memberModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    const member = memberData[memberId];
    if (!member) {
        console.error('Member data not found for:', memberId);
        return;
    }
    
    // 设置弹窗标题
    modalTitle.textContent = 'Dr. Zheng Xu';
    
    // 创建弹窗内容
    modalContent.innerHTML = `
        <div class="member-detail-full">
            <div class="member-detail-info">
                <div class="description">${member.description1}</div>
                ${member.introImage ? `
                    <div class="image-container">
                        <img src="${member.introImage}" alt="Dr. Zheng Xu Introduction" class="member-intro-image">
                        <div class="image-caption">Fig. Overview of the human-centric approach for ADS testing and safety validation (source: Xu Zheng et al. Transp. Res. C. 181, p.105367.)</div>
                    </div>
                ` : ''}
                <div class="description description-formatted">${member.description2.replace(/Dr\. Xu has conducted/g, '<br><br>Dr. Xu has conducted').replace(/Dr\. Xu is currently/g, '<br><br>Dr. Xu is currently')}</div>
            </div>
        </div>
    `;
    
    // 显示弹窗
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', handleModalEscape);
    
    // 点击背景关闭弹窗
    modal.addEventListener('click', handleModalBackgroundClick);
}

// 关闭成员弹窗
function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    
    modal.classList.remove('show');
    document.body.style.overflow = ''; // 恢复背景滚动
    
    // 移除事件监听器
    document.removeEventListener('keydown', handleModalEscape);
    modal.removeEventListener('click', handleModalBackgroundClick);
    
    // 延迟隐藏弹窗，等待动画完成
    setTimeout(() => {
        if (!modal.classList.contains('show')) {
            modal.style.display = 'none';
        }
    }, 300);
}

// 处理ESC键关闭弹窗
function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeMemberModal();
    }
}

// 处理点击背景关闭弹窗
function handleModalBackgroundClick(e) {
    const modal = document.getElementById('memberModal');
    if (e.target === modal) {
        closeMemberModal();
    }
}

// 将函数绑定到全局作用域
window.openMemberModal = openMemberModal;
window.closeMemberModal = closeMemberModal;

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

// 轮播图功能 - Edge兼容版本
function initializeCarousel() {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    let autoSlideInterval;

    // 如果没有轮播图元素，直接返回
    if (totalSlides === 0) return;

    // Edge兼容的forEach替代方法
    function forEachElement(nodeList, callback) {
        if (nodeList.forEach) {
            nodeList.forEach(callback);
        } else {
            // 手动实现forEach用于旧版Edge
            for (let i = 0; i < nodeList.length; i++) {
                callback(nodeList[i], i);
            }
        }
    }

    // 显示指定的幻灯片 - Edge兼容版本
    function showSlide(index) {
        // 移除所有active类
        forEachElement(slides, function(slide) {
            slide.classList.remove('active');
        });
        forEachElement(indicators, function(indicator) {
            indicator.classList.remove('active');
        });
        
        // 添加active类到当前幻灯片
        if (slides[index]) slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        
        currentSlideIndex = index;
    }

    // 切换到下一张或上一张
    function changeSlide(direction) {
        let newIndex = currentSlideIndex + direction;
        
        if (newIndex >= totalSlides) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = totalSlides - 1;
        }
        
        showSlide(newIndex);
        resetAutoSlide();
    }

    // 切换到指定幻灯片
    function currentSlide(index) {
        showSlide(index - 1); // 因为按钮是从1开始的
        resetAutoSlide();
    }

    // 自动轮播 - Edge兼容版本
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            changeSlide(1);
        }, 4000); // 每4秒切换一次
    }

    // 重置自动轮播
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // 暂停自动轮播
    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // 将函数绑定到全局作用域
    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;

    // 添加鼠标悬停暂停功能
    const carousel = document.querySelector('.lab-image-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // 添加键盘控制
    document.addEventListener('keydown', function(e) {
        // 只在lab页面激活时响应键盘事件
        const labPage = document.getElementById('lab');
        if (labPage && labPage.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
                e.preventDefault();
            }
        }
    });

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    changeSlide(-1); // 向右滑动，显示上一张
                } else {
                    changeSlide(1); // 向左滑动，显示下一张
                }
            }
        });
    }

    // 启动自动轮播
    startAutoSlide();
}

// 研究条目展开/收缩功能 - Edge兼容版本
function toggleResearchItem(button) {
    // Edge兼容的closest方法
    function findClosest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        // 手动实现closest方法用于旧版Edge
        let current = element;
        while (current && current !== document.documentElement) {
            if (current.matches && current.matches(selector)) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }
    
    const researchItem = findClosest(button, '.research-item');
    if (!researchItem) return;
    
    const isExpanded = researchItem.classList.contains('expanded');
    
    if (isExpanded) {
        // 收缩
        researchItem.classList.remove('expanded');
    } else {
        // 展开
        researchItem.classList.add('expanded');
        
        // 可选：收缩其他已展开的条目（手风琴效果）
        // const allItems = document.querySelectorAll('.research-item.expanded');
        // allItems.forEach(item => {
        //     if (item !== researchItem) {
        //         item.classList.remove('expanded');
        //     }
        // });
    }
    
    // 平滑滚动到展开的条目 - Edge兼容版本
    if (!isExpanded) {
        setTimeout(function() {
            try {
                const rect = researchItem.getBoundingClientRect();
                const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                
                if (!isInViewport) {
                    // Edge兼容的滚动方法
                    if (researchItem.scrollIntoView) {
                        if (typeof researchItem.scrollIntoView === 'function') {
                            try {
                                researchItem.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest'
                                });
                            } catch (e) {
                                // 降级到基本滚动
                                researchItem.scrollIntoView(false);
                            }
                        } else {
                            researchItem.scrollIntoView(false);
                        }
                    }
                }
            } catch (error) {
                console.log('滚动功能在当前浏览器中不完全支持，但展开功能正常工作');
            }
        }, 300); // 等待展开动画开始
    }
}

