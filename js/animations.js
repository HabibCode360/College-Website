/**
 * Habib College - Animation System
 * Professional animations and visual effects
 * Author: Habib college number 605
 */

class AnimationManager {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.isReducedMotion = false;
        this.animationQueue = [];
        this.isProcessing = false;
        
        this.init();
    }
    
    /**
     * Initialize animation system
     */
    init() {
        this.checkReducedMotion();
        this.initializeScrollAnimations();
        this.initializeHoverEffects();
        this.initializeLoadingAnimations();
        this.initializeParticleSystem();
        this.initializeTransitions();
        this.setupPerformanceOptimizations();
        
        console.log('Animation system initialized');
    }
    
    /**
     * Check for reduced motion preference
     */
    checkReducedMotion() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.updateAnimationsForMotionPreference();
        });
    }
    
    /**
     * Update animations based on motion preference
     */
    updateAnimationsForMotionPreference() {
        if (this.isReducedMotion) {
            this.disableAnimations();
        } else {
            this.enableAnimations();
        }
    }
    
    /**
     * Disable animations for reduced motion
     */
    disableAnimations() {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        
        // Stop all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
    
    /**
     * Enable animations
     */
    enableAnimations() {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('--transition-duration');
        
        // Restart observers
        this.initializeScrollAnimations();
    }
    
    /**
     * Initialize scroll-triggered animations
     */
    initializeScrollAnimations() {
        if (this.isReducedMotion) return;
        
        const observerOptions = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -10% 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerScrollAnimation(entry.target, entry.intersectionRatio);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatableElements = document.querySelectorAll(`
            .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right,
            .scale-in, .rotate-in, .bounce-in, .slide-in-up, .slide-in-down,
            .zoom-in, .flip-in, .roll-in, .elastic-in, .pulse-in,
            [data-animation], .animate-on-scroll
        `);
        
        animatableElements.forEach(element => {
            scrollObserver.observe(element);
        });
        
        this.observers.push(scrollObserver);
    }
    
    /**
     * Trigger scroll animation
     */
    triggerScrollAnimation(element, ratio) {
        const animationType = this.getAnimationType(element);
        const delay = this.getAnimationDelay(element);
        const duration = this.getAnimationDuration(element);
        
        setTimeout(() => {
            this.applyAnimation(element, animationType, duration);
        }, delay);
    }
    
    /**
     * Get animation type from element
     */
    getAnimationType(element) {
        // Check for data attribute first
        if (element.dataset.animation) {
            return element.dataset.animation;
        }
        
        // Check for CSS classes
        const classList = element.classList;
        
        if (classList.contains('fade-in-up')) return 'fadeInUp';
        if (classList.contains('fade-in-down')) return 'fadeInDown';
        if (classList.contains('fade-in-left')) return 'fadeInLeft';
        if (classList.contains('fade-in-right')) return 'fadeInRight';
        if (classList.contains('scale-in')) return 'scaleIn';
        if (classList.contains('rotate-in')) return 'rotateIn';
        if (classList.contains('bounce-in')) return 'bounceIn';
        if (classList.contains('slide-in-up')) return 'slideInUp';
        if (classList.contains('slide-in-down')) return 'slideInDown';
        if (classList.contains('zoom-in')) return 'zoomIn';
        if (classList.contains('flip-in')) return 'flipIn';
        if (classList.contains('roll-in')) return 'rollIn';
        if (classList.contains('elastic-in')) return 'elasticIn';
        if (classList.contains('pulse-in')) return 'pulseIn';
        
        return 'fadeInUp'; // Default
    }
    
    /**
     * Get animation delay from element
     */
    getAnimationDelay(element) {
        const delay = element.dataset.animationDelay || '0';
        return parseInt(delay);
    }
    
    /**
     * Get animation duration from element
     */
    getAnimationDuration(element) {
        const duration = element.dataset.animationDuration || '600';
        return parseInt(duration);
    }
    
    /**
     * Apply animation to element
     */
    applyAnimation(element, type, duration = 600) {
        element.style.animationDuration = `${duration}ms`;
        element.style.animationFillMode = 'both';
        element.classList.add('animated', type);
        
        // Remove animation class after completion
        setTimeout(() => {
            element.classList.remove('animated', type);
            element.style.animationDuration = '';
            element.style.animationFillMode = '';
        }, duration + 100);
    }
    
    /**
     * Initialize hover effects
     */
    initializeHoverEffects() {
        // Card hover effects
        const cards = document.querySelectorAll('.card, .news-card, .faculty-card, .academic-card');
        
        cards.forEach(card => {
            this.addHoverEffect(card, 'lift');
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            this.addHoverEffect(button, 'scale');
        });
        
        // Image hover effects
        const images = document.querySelectorAll('.gallery-item img, .hover-zoom');
        
        images.forEach(image => {
            this.addHoverEffect(image, 'zoom');
        });
        
        // Icon hover effects
        const icons = document.querySelectorAll('.feature-icon, .social-icon');
        
        icons.forEach(icon => {
            this.addHoverEffect(icon, 'bounce');
        });
    }
    
    /**
     * Add hover effect to element
     */
    addHoverEffect(element, effect) {
        if (this.isReducedMotion) return;
        
        element.addEventListener('mouseenter', () => {
            this.applyHoverEffect(element, effect, true);
        });
        
        element.addEventListener('mouseleave', () => {
            this.applyHoverEffect(element, effect, false);
        });
        
        // Add focus effects for accessibility
        element.addEventListener('focus', () => {
            this.applyHoverEffect(element, effect, true);
        });
        
        element.addEventListener('blur', () => {
            this.applyHoverEffect(element, effect, false);
        });
    }
    
    /**
     * Apply hover effect
     */
    applyHoverEffect(element, effect, isHover) {
        switch (effect) {
            case 'lift':
                element.style.transform = isHover ? 'translateY(-5px)' : 'translateY(0)';
                element.style.boxShadow = isHover ? '0 10px 25px rgba(0, 0, 0, 0.15)' : '';
                break;
                
            case 'scale':
                element.style.transform = isHover ? 'scale(1.05)' : 'scale(1)';
                break;
                
            case 'zoom':
                element.style.transform = isHover ? 'scale(1.1)' : 'scale(1)';
                break;
                
            case 'bounce':
                if (isHover) {
                    element.style.animation = 'bounce 0.6s ease';
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 600);
                }
                break;
                
            case 'rotate':
                element.style.transform = isHover ? 'rotate(5deg)' : 'rotate(0deg)';
                break;
                
            case 'glow':
                element.style.boxShadow = isHover ? '0 0 20px rgba(0, 51, 102, 0.3)' : '';
                break;
        }
    }
    
    /**
     * Initialize loading animations
     */
    initializeLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
            this.animatePageLoad();
        });
        
        // Image loading animations
        this.initializeImageLoadingAnimations();
        
        // Content loading animations
        this.initializeContentLoadingAnimations();
    }
    
    /**
     * Hide loading screen with animation
     */
    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    /**
     * Animate page load
     */
    animatePageLoad() {
        if (this.isReducedMotion) return;
        
        // Animate header
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
            
            setTimeout(() => {
                header.style.transition = 'all 0.6s ease';
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }, 100);
        }
        
        // Animate hero content
        const heroContent = document.querySelector('.hero-content, section:first-child');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 0.8s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    /**
     * Initialize image loading animations
     */
    initializeImageLoadingAnimations() {
        const images = document.querySelectorAll('img[data-src], img.lazy-load');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                this.animateImageLoad(img);
            });
        });
    }
    
    /**
     * Animate image load
     */
    animateImageLoad(img) {
        if (this.isReducedMotion) return;
        
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        
        requestAnimationFrame(() => {
            img.style.transition = 'all 0.6s ease';
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
    }
    
    /**
     * Initialize content loading animations
     */
    initializeContentLoadingAnimations() {
        // Skeleton loading animations
        this.initializeSkeletonAnimations();
        
        // Progress bar animations
        this.initializeProgressAnimations();
    }
    
    /**
     * Initialize skeleton loading animations
     */
    initializeSkeletonAnimations() {
        const skeletons = document.querySelectorAll('.skeleton');
        
        skeletons.forEach(skeleton => {
            skeleton.style.background = `
                linear-gradient(90deg, 
                    rgba(255,255,255,0) 0%, 
                    rgba(255,255,255,0.2) 20%, 
                    rgba(255,255,255,0.5) 60%, 
                    rgba(255,255,255,0)
                )
            `;
            skeleton.style.backgroundSize = '200% 100%';
            skeleton.style.animation = 'shimmer 2s infinite';
        });
    }
    
    /**
     * Initialize progress animations
     */
    initializeProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const target = parseInt(bar.dataset.progress || '0');
            this.animateProgress(bar, target);
        });
    }
    
    /**
     * Animate progress bar
     */
    animateProgress(bar, target, duration = 2000) {
        if (this.isReducedMotion) {
            bar.style.width = `${target}%`;
            return;
        }
        
        let current = 0;
        const increment = target / (duration / 16);
        
        const animate = () => {
            current += increment;
            
            if (current >= target) {
                current = target;
            }
            
            bar.style.width = `${current}%`;
            
            if (current < target) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Initialize particle system
     */
    initializeParticleSystem() {
        if (this.isReducedMotion) return;
        
        const particleContainers = document.querySelectorAll('.particles');
        
        particleContainers.forEach(container => {
            this.createParticleSystem(container);
        });
    }
    
    /**
     * Create particle system
     */
    createParticleSystem(container) {
        const particleCount = parseInt(container.dataset.particles || '50');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            container.appendChild(particle);
        }
    }
    
    /**
     * Initialize page transitions
     */
    initializeTransitions() {
        // Link transitions
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!e.metaKey && !e.ctrlKey) {
                    this.initiatePageTransition(e, link.href);
                }
            });
        });
    }
    
    /**
     * Initiate page transition
     */
    initiatePageTransition(e, url) {
        if (this.isReducedMotion) return;
        
        e.preventDefault();
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--oxford-blue);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animate overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Use will-change for animated elements
        this.optimizeAnimatedElements();
        
        // Throttle scroll events
        this.throttleScrollEvents();
        
        // Use requestAnimationFrame for smooth animations
        this.useRAFForAnimations();
    }
    
    /**
     * Optimize animated elements
     */
    optimizeAnimatedElements() {
        const animatedElements = document.querySelectorAll(`
            .animated, .hover-effect, .transition-element,
            [data-animation], .animate-on-scroll
        `);
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            
            // Remove will-change after animation
            element.addEventListener('animationend', () => {
                element.style.willChange = 'auto';
            });
        });
    }
    
    /**
     * Throttle scroll events for performance
     */
    throttleScrollEvents() {
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    this.handleScrollAnimations();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
    
    /**
     * Handle scroll animations
     */
    handleScrollAnimations() {
        // Update parallax elements
        this.updateParallaxElements();
        
        // Update progress indicators
        this.updateScrollProgress();
        
        // Update sticky elements
        this.updateStickyElements();
    }
    
    /**
     * Update parallax elements
     */
    updateParallaxElements() {
        if (this.isReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed || '0.5');
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    /**
     * Update scroll progress
     */
    updateScrollProgress() {
        const progressBars = document.querySelectorAll('.scroll-progress');
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBars.forEach(bar => {
            bar.style.width = `${scrollPercent}%`;
        });
    }
    
    /**
     * Update sticky elements
     */
    updateStickyElements() {
        const stickyElements = document.querySelectorAll('.sticky-animated');
        
        stickyElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isSticky = rect.top <= 0;
            
            element.classList.toggle('is-sticky', isSticky);
        });
    }
    
    /**
     * Use requestAnimationFrame for smooth animations
     */
    useRAFForAnimations() {
        this.animationFrame = null;
        
        this.scheduleAnimation = (callback) => {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            
            this.animationFrame = requestAnimationFrame(callback);
        };
    }
    
    /**
     * Custom easing functions
     */
    static easingFunctions = {
        easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOut: (t) => t * (2 - t),
        easeIn: (t) => t * t,
        bounce: (t) => {
            if (t < 1/2.75) return 7.5625 * t * t;
            if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
            if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
            return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
        },
        elastic: (t) => {
            return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }
    };
    
    /**
     * Animate element with custom easing
     */
    animateElement(element, properties, duration = 600, easing = 'easeInOut') {
        if (this.isReducedMotion) {
            // Apply final state immediately
            Object.assign(element.style, properties);
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const startTime = performance.now();
            const startValues = {};
            const endValues = properties;
            
            // Get initial values
            Object.keys(properties).forEach(prop => {
                startValues[prop] = this.getComputedValue(element, prop);
            });
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = AnimationManager.easingFunctions[easing](progress);
                
                // Apply interpolated values
                Object.keys(properties).forEach(prop => {
                    const startValue = startValues[prop];
                    const endValue = endValues[prop];
                    const currentValue = this.interpolateValue(startValue, endValue, easedProgress);
                    element.style[prop] = currentValue;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Get computed value for property
     */
    getComputedValue(element, property) {
        const computed = getComputedStyle(element);
        return computed[property];
    }
    
    /**
     * Interpolate between two values
     */
    interpolateValue(start, end, progress) {
        // Handle numeric values
        const startNum = parseFloat(start);
        const endNum = parseFloat(end);
        
        if (!isNaN(startNum) && !isNaN(endNum)) {
            const unit = start.replace(startNum.toString(), '');
            return (startNum + (endNum - startNum) * progress) + unit;
        }
        
        // Handle color values
        if (start.includes('rgb') && end.includes('rgb')) {
            return this.interpolateColor(start, end, progress);
        }
        
        // Fallback to end value
        return end;
    }
    
    /**
     * Interpolate between two colors
     */
    interpolateColor(start, end, progress) {
        const startRGB = this.parseRGB(start);
        const endRGB = this.parseRGB(end);
        
        const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * progress);
        const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * progress);
        const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * progress);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    /**
     * Parse RGB color string
     */
    parseRGB(rgb) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }
}

/**
 * Animation utilities and helper functions
 */
const AnimationUtils = {
    /**
     * Add CSS animation keyframes
     */
    addKeyframes(name, keyframes) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${name} {
                ${keyframes}
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Create CSS animation
     */
    createAnimation(element, keyframes, duration = 600, timing = 'ease') {
        const animationName = `custom-animation-${Date.now()}`;
        this.addKeyframes(animationName, keyframes);
        
        element.style.animation = `${animationName} ${duration}ms ${timing}`;
        
        return new Promise((resolve) => {
            element.addEventListener('animationend', () => {
                element.style.animation = '';
                resolve();
            }, { once: true });
        });
    },
    
    /**
     * Chain animations
     */
    chainAnimations(...animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => animation());
        }, Promise.resolve());
    },
    
    /**
     * Parallel animations
     */
    parallelAnimations(...animations) {
        return Promise.all(animations.map(animation => animation()));
    }
};

// Add CSS animations
const animationCSS = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes rotateIn {
        from { opacity: 0; transform: rotate(-200deg); }
        to { opacity: 1; transform: rotate(0); }
    }
    
    @keyframes bounceIn {
        0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
        20% { transform: scale3d(1.1, 1.1, 1.1); }
        40% { transform: scale3d(0.9, 0.9, 0.9); }
        60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
        80% { transform: scale3d(0.97, 0.97, 0.97); }
        100% { opacity: 1; transform: scale3d(1, 1, 1); }
    }
    
    @keyframes slideInUp {
        from { transform: translate3d(0, 100%, 0); visibility: visible; }
        to { transform: translate3d(0, 0, 0); }
    }
    
    @keyframes slideInDown {
        from { transform: translate3d(0, -100%, 0); visibility: visible; }
        to { transform: translate3d(0, 0, 0); }
    }
    
    @keyframes zoomIn {
        from { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
        50% { opacity: 1; }
    }
    
    @keyframes flipIn {
        from { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); opacity: 0; }
        40% { transform: perspective(400px) rotate3d(1, 0, 0, -20deg); }
        60% { transform: perspective(400px) rotate3d(1, 0, 0, 10deg); opacity: 1; }
        80% { transform: perspective(400px) rotate3d(1, 0, 0, -5deg); }
        100% { transform: perspective(400px); }
    }
    
    @keyframes rollIn {
        from { opacity: 0; transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes elasticIn {
        from { opacity: 0; transform: scale3d(0.1, 0.1, 0.1); }
        55% { opacity: 1; transform: scale3d(1.05, 1.05, 1.05); }
        75% { transform: scale3d(0.95, 0.95, 0.95); }
        100% { opacity: 1; transform: scale3d(1, 1, 1); }
    }
    
    @keyframes pulseIn {
        from { opacity: 0; transform: scale3d(0.5, 0.5, 0.5); }
        50% { opacity: 1; transform: scale3d(1.05, 1.05, 1.05); }
        100% { opacity: 1; transform: scale3d(1, 1, 1); }
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
        40%, 43% { transform: translate3d(0, -5px, 0); }
        70% { transform: translate3d(0, -3px, 0); }
        90% { transform: translate3d(0, -1px, 0); }
    }
    
    .animated {
        animation-duration: 0.6s;
        animation-fill-mode: both;
    }
`;

// Inject animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Initialize animation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.animationManager = new AnimationManager();
    window.AnimationUtils = AnimationUtils;
    
    console.log('Animation system ready');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationManager, AnimationUtils };
}
