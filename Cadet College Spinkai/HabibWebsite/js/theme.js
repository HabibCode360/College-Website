/**
 * Habib College - Theme Management
 * Dark/Light mode functionality with system preference detection
 * Author: Habib college number 605
 */

class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.themeToggle = null;
        this.systemPreference = null;
        
        this.init();
    }
    
    /**
     * Initialize theme management
     */
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.systemPreference = this.getSystemPreference();
        
        // Load saved theme or use system preference
        this.currentTheme = this.getSavedTheme() || this.systemPreference;
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for system theme changes
        this.listenForSystemChanges();
        
        console.log('Theme manager initialized:', this.currentTheme);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Add keyboard support
        if (this.themeToggle) {
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }
    
    /**
     * Get system theme preference
     */
    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    /**
     * Get saved theme from localStorage
     */
    getSavedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            console.warn('Unable to access localStorage for theme:', error);
            return null;
        }
    }
    
    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Unable to save theme to localStorage:', error);
        }
    }
    
    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        const html = document.documentElement;
        const body = document.body;
        
        // Remove existing theme classes
        html.classList.remove('light', 'dark');
        body.classList.remove('light', 'dark');
        
        // Add new theme class
        html.classList.add(theme);
        body.classList.add(theme);
        
        // Update theme toggle icon
        this.updateThemeToggleIcon(theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
        
        // Announce to screen readers
        this.announceThemeChange(theme);
        
        this.currentTheme = theme;
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }
    
    /**
     * Update theme toggle button icon
     */
    updateThemeToggleIcon(theme) {
        if (!this.themeToggle) return;
        
        const sunIcon = this.themeToggle.querySelector('.fa-sun');
        const moonIcon = this.themeToggle.querySelector('.fa-moon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }
        
        // Update ARIA label
        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        this.themeToggle.setAttribute('aria-label', label);
        this.themeToggle.setAttribute('title', label);
    }
    
    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const color = theme === 'dark' ? '#1f2937' : '#ffffff';
        metaThemeColor.content = color;
    }
    
    /**
     * Listen for system theme changes
     */
    listenForSystemChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getSavedTheme()) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                }
            });
        }
    }
    
    /**
     * Dispatch custom theme change event
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Announce theme change to screen readers
     */
    announceThemeChange(theme) {
        const message = `Switched to ${theme} mode`;
        
        // Use the live region from main.js if available
        if (window.HabibCollege && window.HabibCollege.announceToScreenReader) {
            window.HabibCollege.announceToScreenReader(message);
        } else {
            // Fallback announcement method
            this.createTemporaryAnnouncement(message);
        }
    }
    
    /**
     * Create temporary announcement for screen readers
     */
    createTemporaryAnnouncement(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
            this.saveTheme(theme);
        }
    }
    
    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        try {
            localStorage.removeItem('theme');
        } catch (error) {
            console.warn('Unable to remove theme from localStorage:', error);
        }
        
        const systemTheme = this.getSystemPreference();
        this.applyTheme(systemTheme);
    }
}

/**
 * Theme-aware component updates
 */
class ThemeAwareComponents {
    constructor() {
        this.init();
    }
    
    init() {
        // Listen for theme changes
        document.addEventListener('themechange', (e) => {
            this.updateComponents(e.detail.theme);
        });
    }
    
    /**
     * Update components when theme changes
     */
    updateComponents(theme) {
        this.updateImages(theme);
        this.updateCharts(theme);
        this.updateMaps(theme);
        this.updateCodeBlocks(theme);
    }
    
    /**
     * Update images with theme variants
     */
    updateImages(theme) {
        const themeImages = document.querySelectorAll('[data-light-src][data-dark-src]');
        
        themeImages.forEach(img => {
            const newSrc = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
            if (newSrc && img.src !== newSrc) {
                img.src = newSrc;
            }
        });
    }
    
    /**
     * Update charts for theme
     */
    updateCharts(theme) {
        // Update chart.js charts if present
        if (window.Chart && window.Chart.instances) {
            const chartColors = this.getChartColors(theme);
            
            Object.values(window.Chart.instances).forEach(chart => {
                if (chart && chart.options) {
                    // Update chart colors
                    this.updateChartColors(chart, chartColors);
                    chart.update();
                }
            });
        }
    }
    
    /**
     * Get chart colors for theme
     */
    getChartColors(theme) {
        return theme === 'dark' ? {
            background: '#1f2937',
            text: '#f9fafb',
            grid: '#374151',
            primary: '#3b82f6',
            secondary: '#8b5cf6'
        } : {
            background: '#ffffff',
            text: '#111827',
            grid: '#e5e7eb',
            primary: '#003366',
            secondary: '#1e3a8a'
        };
    }
    
    /**
     * Update individual chart colors
     */
    updateChartColors(chart, colors) {
        if (chart.options.scales) {
            // Update axis colors
            Object.values(chart.options.scales).forEach(scale => {
                if (scale.ticks) scale.ticks.color = colors.text;
                if (scale.grid) scale.grid.color = colors.grid;
            });
        }
        
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = colors.text;
        }
    }
    
    /**
     * Update maps for theme
     */
    updateMaps(theme) {
        // Update Google Maps or other map instances
        const maps = document.querySelectorAll('.map-container[data-map]');
        
        maps.forEach(mapContainer => {
            const mapInstance = mapContainer.mapInstance;
            if (mapInstance && mapInstance.setOptions) {
                const mapStyles = this.getMapStyles(theme);
                mapInstance.setOptions({ styles: mapStyles });
            }
        });
    }
    
    /**
     * Get map styles for theme
     */
    getMapStyles(theme) {
        return theme === 'dark' ? [
            { elementType: 'geometry', stylers: [{ color: '#212121' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] }
        ] : [];
    }
    
    /**
     * Update code blocks for theme
     */
    updateCodeBlocks(theme) {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        
        codeBlocks.forEach(block => {
            block.className = block.className.replace(
                theme === 'dark' ? 'prism-light' : 'prism-dark',
                theme === 'dark' ? 'prism-dark' : 'prism-light'
            );
        });
    }
}

/**
 * Theme utilities
 */
const ThemeUtils = {
    /**
     * Get CSS custom property value
     */
    getCSSProperty(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    },
    
    /**
     * Set CSS custom property
     */
    setCSSProperty(property, value) {
        document.documentElement.style.setProperty(property, value);
    },
    
    /**
     * Check if dark mode is enabled
     */
    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    },
    
    /**
     * Check if light mode is enabled
     */
    isLightMode() {
        return document.documentElement.classList.contains('light');
    },
    
    /**
     * Get theme-appropriate color
     */
    getThemeColor(lightColor, darkColor) {
        return this.isDarkMode() ? darkColor : lightColor;
    }
};

// Initialize theme management when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Initialize theme-aware components
    new ThemeAwareComponents();
    
    // Make theme utilities globally available
    window.ThemeUtils = ThemeUtils;
    
    console.log('Theme system initialized successfully');
});

// Handle theme persistence across page loads
document.addEventListener('DOMContentLoaded', function() {
    // Prevent flash of unstyled content (FOUC)
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.classList.add(theme);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeAwareComponents, ThemeUtils };
}
