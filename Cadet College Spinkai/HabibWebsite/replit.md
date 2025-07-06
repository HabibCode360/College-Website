# Habib College Website

## Overview

The Habib College website is a static educational institution website built with modern web technologies. It serves as the primary digital presence for Habib College, providing information about academic programs, faculty, admissions, and campus life. The website follows Oxford University-inspired design principles with a professional academic aesthetic.

## System Architecture

### Frontend Architecture
- **Pure HTML/CSS/JavaScript**: Static website with no backend dependencies
- **Component-based Structure**: Modular HTML pages with shared components
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Modern JavaScript**: ES6+ features with class-based architecture
- **Progressive Enhancement**: Core functionality works without JavaScript

### Design System
- **Typography**: Multi-font system using Playfair Display (serif), Inter (sans-serif), and Crimson Text
- **Color Scheme**: Academic color palette with Oxford blue, navy blue, academic green, and gold accents
- **Theme Support**: Dark/light mode with system preference detection
- **Animation System**: Performance-optimized animations with reduced motion support

## Key Components

### Core Pages
- **Homepage** (`index.html`): Main landing page with hero section and key information
- **About** (`about.html`): College history, mission, and values
- **Programs** (`programs.html`): Academic programs and course offerings
- **Faculty** (`faculty.html`): Faculty profiles and expertise
- **Admissions** (`admissions.html`): Application process and requirements
- **News** (`news.html`): Latest news and events
- **Gallery** (`gallery.html`): Campus photos and media
- **Contact** (`contact.html`): Contact information and forms
- **404** (`404.html`): Custom error page

### JavaScript Modules
- **Main** (`js/main.js`): Core application initialization and utilities
- **Navigation** (`js/navigation.js`): Advanced navigation management with mobile support
- **Theme** (`js/theme.js`): Dark/light mode functionality
- **Animations** (`js/animations.js`): Animation system with performance optimization

### Styling
- **Custom CSS** (`css/style.css`): Custom styles and theme variables
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Professional typography stack

## Data Flow

### Client-Side Architecture
1. **Page Load**: HTML loads with inline CSS and JavaScript
2. **Initialization**: Main.js initializes all components and managers
3. **Theme Application**: ThemeManager applies saved or system theme
4. **Navigation Setup**: NavigationManager handles menu interactions
5. **Animation Setup**: AnimationManager initializes scroll and hover effects
6. **Content Loading**: Lazy loading for images and dynamic content

### State Management
- **Theme State**: Stored in localStorage with system preference fallback
- **Navigation State**: Managed by NavigationManager class
- **Animation State**: Tracked by AnimationManager with performance monitoring
- **Form State**: Local validation and submission handling

## External Dependencies

### CDN Resources
- **Tailwind CSS**: `https://cdn.tailwindcss.com` - CSS framework
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` - Icons
- **Google Fonts**: Playfair Display, Inter, and Crimson Text fonts

### Third-Party Integrations
- **Font Loading**: Google Fonts with preconnect optimization
- **Icon System**: Font Awesome for consistent iconography
- **CSS Framework**: Tailwind CSS for responsive design

## Deployment Strategy

### Static Hosting
- **Platform**: Designed for static hosting (Netlify, Vercel, GitHub Pages)
- **Build Process**: No build step required - direct HTML/CSS/JS
- **Performance**: Optimized for fast loading with CDN resources
- **Caching**: Static assets can be cached indefinitely

### SEO Optimization
- **Meta Tags**: Comprehensive meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Semantic HTML**: Proper heading hierarchy and markup
- **Accessibility**: ARIA labels and keyboard navigation support

### Performance Considerations
- **Lazy Loading**: Images and content loaded on demand
- **Intersection Observer**: Efficient scroll animations
- **Reduced Motion**: Respect user motion preferences
- **Font Loading**: Optimized font loading strategy

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```