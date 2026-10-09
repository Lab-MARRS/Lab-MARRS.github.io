/* Navigation and slideshow enhancement. Content remains available without JavaScript. */
(() => {
    'use strict';

    function initializeSite() {
        const pages = [...document.querySelectorAll('.page')];
        const pageIds = new Set(pages.map(page => page.id));
        const navLinks = document.querySelectorAll('.nav-link');
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('primary-navigation');
        const navbar = document.querySelector('.navbar');
        const mobileViewport = window.matchMedia('(max-width: 48rem)');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let activePageId = 'lab';
        let syncCarousel = () => {};

        function setMenu(open) {
            if (!menu || !menuToggle) return;
            const expanded = mobileViewport.matches && open;
            menu.classList.toggle('active', expanded);
            menuToggle.classList.toggle('active', expanded);
            menuToggle.setAttribute('aria-expanded', String(expanded));
            menuToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
            menu.inert = mobileViewport.matches && !expanded;
        }

        function resolveRoute() {
            let hash;
            try {
                hash = decodeURIComponent(window.location.hash.slice(1));
            } catch {
                hash = '';
            }
            if (!hash) return { pageId: 'lab', target: null };

            const [pageId, ...parts] = hash.split('/');
            if (pageIds.has(pageId)) {
                const articleId = pageId === 'news' && parts.length ? `news-${parts.join('/')}` : null;
                return { pageId, target: articleId ? document.getElementById(articleId) : null };
            }

            const target = document.getElementById(hash);
            return { pageId: target?.closest('.page')?.id || activePageId, target };
        }

        function renderRoute({ focus = false } = {}) {
            const { pageId, target } = resolveRoute();
            activePageId = pageId;
            pages.forEach(page => {
                const active = page.id === pageId;
                page.classList.toggle('active', active);
                page.hidden = !active;
            });
            navLinks.forEach(link => {
                const active = link.dataset.page === pageId;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
            setMenu(false);
            syncCarousel();

            const page = document.getElementById(pageId);
            const destination = target || page?.querySelector('h1');
            if (focus && destination) {
                destination.setAttribute('tabindex', '-1');
                destination.focus({ preventScroll: true });
            }
            if (target) {
                target.scrollIntoView({ behavior: focus && !reducedMotion.matches ? 'smooth' : 'instant', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: focus && !reducedMotion.matches ? 'smooth' : 'instant' });
            }
        }

        document.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const link = event.target.closest('a[href^="#"]');
            if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const href = link.getAttribute('href');
            const pageId = href.slice(1).split('/')[0];
            if (!pageIds.has(pageId)) return;
            event.preventDefault();
            if (window.location.hash === href) renderRoute({ focus: true });
            else window.location.hash = href;
        });

        window.addEventListener('hashchange', () => renderRoute({ focus: true }));
        menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
        mobileViewport.addEventListener('change', () => setMenu(false));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
                setMenu(false);
                menuToggle.focus();
            }
        });
        document.addEventListener('pointerdown', event => {
            if (menuToggle?.getAttribute('aria-expanded') === 'true' && !navbar?.contains(event.target)) setMenu(false);
        });

        function updateNavbar() {
            navbar?.classList.toggle('scrolled', window.scrollY > 10);
        }
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();

        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.relList.add('noopener', 'noreferrer');
        });

        initializeResearch();
        document.documentElement.classList.add('js');
        renderRoute();
        syncCarousel = initializeCarousel(reducedMotion);
        syncCarousel();
    }

    function initializeResearch() {
        document.querySelectorAll('[data-research-toggle]').forEach(button => {
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            if (!panel) return;
            panel.hidden = true;
            button.setAttribute('aria-expanded', 'false');
        });
        document.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest('[data-research-toggle]');
            if (!button) return;
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            const article = button.closest('.research-item');
            if (!panel || !article) return;
            const expanded = button.getAttribute('aria-expanded') !== 'true';
            panel.hidden = !expanded;
            button.setAttribute('aria-expanded', String(expanded));
            article.classList.toggle('expanded', expanded);
            const title = article.querySelector('h2')?.textContent.trim() || 'this research area';
            button.setAttribute('aria-label', `${expanded ? 'Hide' : 'Show'} publications for ${title}`);
        });
    }

    function initializeCarousel(reducedMotion) {
        const carousel = document.querySelector('.lab-image-carousel');
        const slides = carousel ? [...carousel.querySelectorAll('.carousel-slide')] : [];
        if (!slides.length) return () => {};

        let slideIndex = 0;
        let timer;
        let touchControlsTimer;
        let hovered = false;
        let inViewport = true;
        let touchStart = null;

        function syncPlayback() {
            window.clearTimeout(timer);
            const hasFocus = carousel.contains(document.activeElement);
            const labActive = document.getElementById('lab')?.classList.contains('active');
            const playing = slides.length > 1 && !reducedMotion.matches && !hovered && !hasFocus && !touchStart && !document.hidden && labActive && inViewport;
            carousel.querySelector('.carousel-slides')?.setAttribute('aria-live', playing ? 'off' : 'polite');
            if (playing) timer = window.setTimeout(() => showSlide(slideIndex + 1), 4000);
        }

        function showSlide(index) {
            slideIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, current) => {
                const active = current === slideIndex;
                slide.classList.toggle('active', active);
                slide.setAttribute('aria-hidden', String(!active));
                slide.inert = !active;
                slide.setAttribute('role', 'group');
                slide.setAttribute('aria-roledescription', 'slide');
                slide.setAttribute('aria-label', `${current + 1} of ${slides.length}`);
            });
            syncPlayback();
        }

        carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => showSlide(slideIndex - 1));
        carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => showSlide(slideIndex + 1));
        carousel.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse') {
                hovered = true;
                syncPlayback();
            }
        });
        carousel.addEventListener('pointerleave', () => {
            hovered = false;
            syncPlayback();
        });
        carousel.addEventListener('focusin', syncPlayback);
        carousel.addEventListener('focusout', () => window.setTimeout(syncPlayback, 0));
        document.addEventListener('visibilitychange', syncPlayback);
        reducedMotion.addEventListener('change', syncPlayback);

        carousel.addEventListener('keydown', event => {
            const keys = { ArrowLeft: slideIndex - 1, ArrowRight: slideIndex + 1, Home: 0, End: slides.length - 1 };
            if (Object.hasOwn(keys, event.key)) {
                event.preventDefault();
                showSlide(keys[event.key]);
            }
        });
        carousel.addEventListener('pointerdown', event => {
            if (event.pointerType !== 'touch') return;
            touchStart = { x: event.clientX, y: event.clientY };
            window.clearTimeout(touchControlsTimer);
            carousel.classList.add('controls-visible');
            syncPlayback();
        });
        function finishTouch() {
            touchStart = null;
            touchControlsTimer = window.setTimeout(() => carousel.classList.remove('controls-visible'), 3000);
            syncPlayback();
        }
        carousel.addEventListener('pointerup', event => {
            if (!touchStart || event.pointerType !== 'touch') return;
            const x = event.clientX - touchStart.x;
            const y = event.clientY - touchStart.y;
            if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5) showSlide(slideIndex + (x > 0 ? -1 : 1));
            finishTouch();
        });
        carousel.addEventListener('pointercancel', finishTouch);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                inViewport = entries[0].isIntersecting;
                syncPlayback();
            }).observe(carousel);
        }

        showSlide(0);
        return syncPlayback;
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSite, { once: true });
    else initializeSite();
})();
