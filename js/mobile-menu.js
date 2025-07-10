/**
 * Mobile Menu and Theme Toggle JavaScript
 * Handles responsive navigation and dark mode functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeThemeToggle();
    initializeAccessibility();
    initializeResponsiveHandler();
});

/**
 * Initialize Mobile Menu Functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuToggle || !mobileMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = mobileMenu.classList.contains('mobile-menu-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) { // lg breakpoint
            closeMobileMenu();
        }
    });

    /**
     * Open Mobile Menu
     */
    function openMobileMenu() {
        mobileMenu.classList.add('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Close mobile menu');
        
        // Focus management
        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add escape handler
        trapFocus(mobileMenu);
    }

    /**
     * Close Mobile Menu
     */
    function closeMobileMenu() {
        mobileMenu.classList.remove('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open mobile menu');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Trap focus within mobile menu
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

/**
 * Initialize Theme Toggle Functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
        }
    });

    /**
     * Enable Dark Mode
     */
    function enableDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        
        // Update meta theme-color for mobile browsers
        updateThemeColor('#111827');
    }

    /**
     * Enable Light Mode
     */
    function enableLightMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        
        // Update meta theme-color for mobile browsers
        updateThemeColor('#ffffff');
    }

    /**
     * Update theme color meta tag
     */
    function updateThemeColor(color) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.setAttribute('content', color);
    }
}

/**
 * Initialize Accessibility Features
 */
function initializeAccessibility() {
    // Add skip links navigation
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.focus();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Alt + M for mobile menu toggle
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileMenuToggle && window.innerWidth < 1024) {
                mobileMenuToggle.click();
            }
        }
        
        // Alt + T for theme toggle
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
    });

    // Add focus indicators for better visibility
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
}

/**
 * Initialize Responsive Handler
 */
function initializeResponsiveHandler() {
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('mobile-menu-open')) {
                // Recalculate menu position after orientation change
                mobileMenu.style.maxHeight = `${window.innerHeight - 100}px`;
            }
        }, 100);
    });

    // Handle viewport changes for better mobile experience
    let viewportHeight = window.innerHeight;
    window.addEventListener('resize', function() {
        // Only trigger on width changes, not height (to avoid issues with mobile keyboards)
        if (Math.abs(window.innerHeight - viewportHeight) < 150) {
            updateResponsiveElements();
        }
        viewportHeight = window.innerHeight;
    });

    /**
     * Update responsive elements based on screen size
     */
    function updateResponsiveElements() {
        const header = document.querySelector('header');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (window.innerWidth >= 1024) {
            // Desktop view
            if (mobileMenu) {
                mobileMenu.classList.remove('mobile-menu-open');
            }
            document.body.style.overflow = '';
        } else {
            // Mobile/tablet view
            if (mobileMenu && mobileMenu.classList.contains('mobile-menu-open')) {
                mobileMenu.style.maxHeight = `${window.innerHeight - header.offsetHeight}px`;
            }
        }
    }

    // Initialize on load
    updateResponsiveElements();
}

/**
 * Utility function to detect touch devices
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Enhanced error handling and logging
 */
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // You can add error reporting here
    // For example, send error to analytics or error tracking service
}

/**
 * Debounce function for performance optimization
 */
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

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation && navigation.loadEventEnd > 0) {
                console.log(`Page load time: ${navigation.loadEventEnd}ms`);
            }
        }, 0);
    });
}

// Export functions for potential external use
window.MobileMenuAPI = {
    close: function() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-open');
        }
    },
    open: function() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.click();
        }
    }
};
