/**
 * Habib College - Navigation Management
 * Advanced navigation functionality with mobile support
 * Author: Habib college number 605
 */

class NavigationManager {
    constructor() {
        this.mobileMenuToggle = null;
        this.mobileMenu = null;
        this.header = null;
        this.lastScrollTop = 0;
        this.isScrolling = false;
        this.dropdowns = [];
        
        this.init();
    }
    
    /**
     * Initialize navigation management
     */
    init() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.header = document.querySelector('header');
        
        this.setupEventListeners();
        this.initializeDropdowns();
        this.initializeScrollBehavior();
        this.initializeBreadcrumbs();
        this.setupAccessibilityFeatures();
        
        console.log('Navigation manager initialized');
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuToggle?.contains(e.target) && !this.mobileMenu?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                this.closeAllDropdowns();
            }
        });
        
        // Smooth scrolling for anchor links
        this.initializeSmoothScrolling();
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (!this.mobileMenu) return;
        
        const isOpen = !this.mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Open mobile menu
     */
    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;
        
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Update icon
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // Focus first menu item
        const firstMenuItem = this.mobileMenu.querySelector('a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
        
        // Prevent body scroll
        document.body.classList.add('overflow-hidden');
        
        // Announce to screen readers
        this.announceToScreenReader('Menu opened');
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;
        
        this.mobileMenu.classList.add('hidden');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Update icon
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Allow body scroll
        document.body.classList.remove('overflow-hidden');
        
        // Return focus to toggle button
        this.mobileMenuToggle.focus();
        
        // Announce to screen readers
        this.announceToScreenReader('Menu closed');
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth >= 1024) {
            this.closeMobileMenu();
        }
    }
    
    /**
     * Initialize dropdown functionality
     */
    initializeDropdowns() {
        const dropdownTriggers = document.querySelectorAll('[data-dropdown]');
        
        dropdownTriggers.forEach(trigger => {
            const dropdownId = trigger.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown) {
                this.dropdowns.push({ trigger, dropdown });
                this.setupDropdown(trigger, dropdown);
            }
        });
    }
    
    /**
     * Set up individual dropdown
     */
    setupDropdown(trigger, dropdown) {
        let hoverTimeout;
        
        // Mouse events
        trigger.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            this.openDropdown(dropdown);
        });
        
        trigger.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                this.closeDropdown(dropdown);
            }, 150);
        });
        
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
        });
        
        dropdown.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                this.closeDropdown(dropdown);
            }, 150);
        });
        
        // Keyboard events
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown(dropdown);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.openDropdown(dropdown);
                this.focusFirstDropdownItem(dropdown);
            }
        });
        
        // Set up dropdown navigation
        this.setupDropdownNavigation(dropdown);
    }
    
    /**
     * Set up dropdown keyboard navigation
     */
    setupDropdownNavigation(dropdown) {
        const items = dropdown.querySelectorAll('a, button');
        
        items.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % items.length;
                        items[nextIndex].focus();
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + items.length) % items.length;
                        items[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        items[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        items[items.length - 1].focus();
                        break;
                        
                    case 'Escape':
                        e.preventDefault();
                        this.closeDropdown(dropdown);
                        // Return focus to trigger
                        const trigger = document.querySelector(`[data-dropdown="${dropdown.id}"]`);
                        if (trigger) trigger.focus();
                        break;
                }
            });
        });
    }
    
    /**
     * Open dropdown
     */
    openDropdown(dropdown) {
        this.closeAllDropdowns();
        dropdown.classList.add('open');
        dropdown.setAttribute('aria-hidden', 'false');
    }
    
    /**
     * Close dropdown
     */
    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        dropdown.setAttribute('aria-hidden', 'true');
    }
    
    /**
     * Toggle dropdown
     */
    toggleDropdown(dropdown) {
        if (dropdown.classList.contains('open')) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }
    
    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
        this.dropdowns.forEach(({ dropdown }) => {
            this.closeDropdown(dropdown);
        });
    }
    
    /**
     * Focus first dropdown item
     */
    focusFirstDropdownItem(dropdown) {
        const firstItem = dropdown.querySelector('a, button');
        if (firstItem) {
            setTimeout(() => firstItem.focus(), 100);
        }
    }
    
    /**
     * Initialize scroll behavior
     */
    initializeScrollBehavior() {
        if (!this.header) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header hide/show on scroll
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
            // Scrolling down
            this.hideHeader();
        } else {
            // Scrolling up
            this.showHeader();
        }
        
        // Update active navigation item
        this.updateActiveNavigation();
        
        this.lastScrollTop = currentScrollTop;
    }
    
    /**
     * Hide header on scroll down
     */
    hideHeader() {
        if (this.header) {
            this.header.style.transform = 'translateY(-100%)';
        }
    }
    
    /**
     * Show header on scroll up
     */
    showHeader() {
        if (this.header) {
            this.header.style.transform = 'translateY(0)';
        }
    }
    
    /**
     * Update active navigation based on scroll position
     */
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Initialize smooth scrolling
     */
    initializeSmoothScrolling() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element, offset = 80) {
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Focus the target element for accessibility
        setTimeout(() => {
            element.setAttribute('tabindex', '-1');
            element.focus();
            element.addEventListener('blur', () => {
                element.removeAttribute('tabindex');
            }, { once: true });
        }, 500);
    }
    
    /**
     * Initialize breadcrumbs
     */
    initializeBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return;
        
        // Add structured data for breadcrumbs
        this.addBreadcrumbStructuredData();
        
        // Make breadcrumbs keyboard accessible
        const breadcrumbLinks = breadcrumbs.querySelectorAll('a');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    link.click();
                }
            });
        });
    }
    
    /**
     * Add breadcrumb structured data for SEO
     */
    addBreadcrumbStructuredData() {
        const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
        if (breadcrumbItems.length === 0) return;
        
        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };
        
        breadcrumbItems.forEach((item, index) => {
            const link = item.querySelector('a');
            if (link) {
                breadcrumbList.itemListElement.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": link.textContent.trim(),
                    "item": link.href
                });
            }
        });
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    }
    
    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add skip links
        this.addSkipLinks();
        
        // Improve navigation ARIA labels
        this.improveNavigationLabels();
        
        // Add landmark roles
        this.addLandmarkRoles();
    }
    
    /**
     * Add skip links for accessibility
     */
    addSkipLinks() {
        const skipLinks = document.querySelector('.skip-links');
        if (skipLinks) return; // Skip links already exist
        
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links sr-only';
        skipLinksContainer.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
        
        // Style skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
            }
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Improve navigation ARIA labels
     */
    improveNavigationLabels() {
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            this.mobileMenuToggle.setAttribute('aria-controls', 'mobile-menu');
        }
        
        if (this.mobileMenu) {
            this.mobileMenu.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Add landmark roles
     */
    addLandmarkRoles() {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');
        
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }
        
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }
        
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }
    
    /**
     * Announce to screen readers
     */
    announceToScreenReader(message) {
        if (window.HabibCollege && window.HabibCollege.announceToScreenReader) {
            window.HabibCollege.announceToScreenReader(message);
        }
    }
    
    /**
     * Get current active page
     */
    getCurrentPage() {
        const activeLink = document.querySelector('.nav-link.active');
        return activeLink ? activeLink.textContent.trim() : 'Home';
    }
    
    /**
     * Highlight current page in navigation
     */
    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}

/**
 * Navigation utilities
 */
const NavigationUtils = {
    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    /**
     * Get all focusable elements within container
     */
    getFocusableElements(container) {
        return container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    },
    
    /**
     * Trap focus within element
     */
    trapFocus(element) {
        const focusableElements = this.getFocusableElements(element);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
    window.NavigationUtils = NavigationUtils;
    
    // Highlight current page
    window.navigationManager.highlightCurrentPage();
    
    console.log('Navigation system initialized successfully');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, NavigationUtils };
}
