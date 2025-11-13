/**
 * {{COOPERATIVE_NAME}} Website Scripts
 * Interactive functionality for the institutional website
 */

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================

class Carousel {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.carousel-slide');
    this.indicators = container.querySelectorAll('.indicator');
    this.prevBtn = container.querySelector('.carousel-control.prev');
    this.nextBtn = container.querySelector('.carousel-control.next');
    this.currentSlide = 0;
    this.autoplayInterval = null;
    
    this.init();
  }
  
  init() {
    // Add event listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Start autoplay
    this.startAutoplay();
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }
  
  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide]?.classList.remove('active');
    
    this.currentSlide = index;
    
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide]?.classList.add('active');
  }
  
  next() {
    const nextSlide = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextSlide);
  }
  
  prev() {
    const prevSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevSlide);
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 5000);
  }
  
  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
}

// ========================================
// FORM VALIDATION
// ========================================

class FormValidator {
  constructor(form) {
    this.form = form;
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    const isValid = this.validateForm();
    
    if (isValid) {
      this.submitForm();
    }
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (basic)
    if (type === 'tel' && value) {
      const phoneRegex = /^[+]?[\d\s\-()]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Checkbox validation
    if (type === 'checkbox' && field.hasAttribute('required')) {
      if (!field.checked) {
        isValid = false;
        errorMessage = 'You must agree to continue';
      }
    }
    
    // Display error
    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }
    
    return isValid;
  }
  
  showError(field, message) {
    field.classList.add('error');
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  
  clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
  
  submitForm() {
    // In a real application, this would send data to a server
    // For now, we'll just show a success message
    
    const successMessage = document.getElementById('form-success-message');
    if (successMessage) {
      successMessage.style.display = 'flex';
      this.form.reset();
      
      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Hide after 5 seconds
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    } else {
      alert('Thank you for your message! We\'ll get back to you soon.');
      this.form.reset();
    }
  }
}

// ========================================
// LANGUAGE SWITCHER
// ========================================

class LanguageSwitcher {
  constructor() {
    this.currentLang = 'en';
    this.langButtons = document.querySelectorAll('.lang-btn');
    this.init();
  }
  
  init() {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    this.switchLanguage(savedLang);
    
    // Add click handlers
    this.langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        this.switchLanguage(lang);
      });
    });
  }
  
  switchLanguage(lang) {
    this.currentLang = lang;
    
    // Update button states
    this.langButtons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(el => {
      const translation = el.dataset[lang];
      if (translation) {
        el.textContent = translation;
      }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-' + lang + '-placeholder]');
    placeholderElements.forEach(el => {
      const translation = el.dataset[lang + 'Placeholder'];
      if (translation) {
        el.placeholder = translation;
      }
    });
    
    // Save preference
    localStorage.setItem('preferred-language', lang);
  }
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================

class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.querySelector('.main-nav');
    this.init();
  }
  
  init() {
    if (!this.toggle || !this.nav) return;
    
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.toggle.contains(e.target) && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    const isOpen = this.nav.classList.toggle('active');
    this.toggle.setAttribute('aria-expanded', isOpen);
  }
  
  closeMenu() {
    this.nav.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
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
    
    // Add scroll-based animations using Intersection Observer
    this.observeElements();
  }
  
  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cards and sections
    const elements = document.querySelectorAll('.product-card, .news-card, .testimonial-card, .stat-item');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
      .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ========================================
// NEWS FILTER
// ========================================

class NewsFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.newsCards = document.querySelectorAll('.news-card');
    this.init();
  }
  
  init() {
    if (this.filterButtons.length === 0) return;
    
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filterNews(filter);
        
        // Update active button
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  
  filterNews(category) {
    this.newsCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// ========================================
// STICKY HEADER
// ========================================

class StickyHeader {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.lastScroll = 0;
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow on scroll
      if (currentScroll > 0) {
        this.header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      } else {
        this.header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
      }
      
      this.lastScroll = currentScroll;
    });
  }
}

// ========================================
// NEWSLETTER FORM
// ========================================

class NewsletterForm {
  constructor() {
    this.forms = document.querySelectorAll('#newsletter-form');
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  }
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // In a real application, this would send to a server
    alert('Thank you for subscribing to our newsletter!');
    form.reset();
  }
}

// ========================================
// VIDEO PLAYER (Placeholder Interaction)
// ========================================

class VideoPlayers {
  constructor() {
    this.videoPlaceholders = document.querySelectorAll('.video-placeholder');
    this.init();
  }
  
  init() {
    this.videoPlaceholders.forEach(placeholder => {
      placeholder.addEventListener('click', () => {
        // In a real application, this would open a video modal
        alert('Video player would open here. In production, integrate with YouTube, Vimeo, or custom video player.');
      });
    });
  }
}

// ========================================
// GALLERY LIGHTBOX (Placeholder)
// ========================================

class GalleryLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.init();
  }
  
  init() {
    this.galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // In a real application, this would open a lightbox
        alert('Image lightbox would open here. In production, integrate with a lightbox library.');
      });
      
      // Add keyboard navigation
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

class SearchHandler {
  constructor() {
    this.searchForms = document.querySelectorAll('.search-bar');
    this.init();
  }
  
  init() {
    this.searchForms.forEach(form => {
      const searchBtn = form.querySelector('.search-btn');
      const searchInput = form.querySelector('.search-input');
      
      if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
        
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch(searchInput.value);
          }
        });
      }
    });
  }
  
  performSearch(query) {
    if (!query.trim()) {
      return;
    }
    
    // In a real application, this would perform an actual search
    alert(`Search functionality would search for: "${query}"\n\nIn production, integrate with a search engine or implement client-side search.`);
  }
}

// ========================================
// LOAD MORE FUNCTIONALITY
// ========================================

class LoadMore {
  constructor() {
    this.loadMoreBtns = document.querySelectorAll('.btn:contains("Load More")');
    this.init();
  }
  
  init() {
    // Find buttons with "Load More" text
    const buttons = Array.from(document.querySelectorAll('.btn')).filter(btn => 
      btn.textContent.includes('Load More') || 
      btn.textContent.includes('Carregar Mais') ||
      btn.textContent.includes('Cargar Más')
    );
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // In a real application, this would load more content
        alert('This would load more news articles. In production, implement pagination or infinite scroll.');
      });
    });
  }
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

class AccessibilityEnhancements {
  constructor() {
    this.init();
  }
  
  init() {
    // Add skip to main content link
    this.addSkipLink();
    
    // Enhance focus visibility
    this.enhanceFocusVisibility();
    
    // Add ARIA labels where missing
    this.addAriaLabels();
  }
  
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
      position: absolute;
      left: -9999px;
      z-index: 999;
      padding: 1em;
      background-color: #000;
      color: #fff;
      opacity: 0;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.left = '0';
      skipLink.style.opacity = '1';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.left = '-9999px';
      skipLink.style.opacity = '0';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }
  
  enhanceFocusVisibility() {
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }
  
  addAriaLabels() {
    // Add aria-label to elements that need it
    const elements = document.querySelectorAll('a, button');
    elements.forEach(el => {
      if (!el.hasAttribute('aria-label') && !el.textContent.trim() && el.querySelector('svg')) {
        const parent = el.closest('.social-link, .search-btn, .carousel-control');
        if (parent) {
          el.setAttribute('aria-label', this.generateAriaLabel(el));
        }
      }
    });
  }
  
  generateAriaLabel(element) {
    if (element.classList.contains('social-link')) return 'Social media link';
    if (element.classList.contains('search-btn')) return 'Search';
    if (element.classList.contains('prev')) return 'Previous slide';
    if (element.classList.contains('next')) return 'Next slide';
    return 'Button';
  }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousel
  const carouselContainer = document.querySelector('.hero-carousel');
  if (carouselContainer) {
    new Carousel(carouselContainer);
  }
  
  // Initialize forms
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    new FormValidator(contactForm);
  }
  
  const newsletterForms = new NewsletterForm();
  
  // Initialize language switcher
  const languageSwitcher = new LanguageSwitcher();
  
  // Initialize mobile menu
  const mobileMenu = new MobileMenu();
  
  // Initialize scroll animations
  const scrollAnimations = new ScrollAnimations();
  
  // Initialize news filter
  const newsFilter = new NewsFilter();
  
  // Initialize sticky header
  const stickyHeader = new StickyHeader();
  
  // Initialize video players
  const videoPlayers = new VideoPlayers();
  
  // Initialize gallery lightbox
  const galleryLightbox = new GalleryLightbox();
  
  // Initialize search
  const searchHandler = new SearchHandler();
  
  // Initialize load more
  const loadMore = new LoadMore();
  
  // Initialize accessibility enhancements
  const accessibility = new AccessibilityEnhancements();
  
  // Add smooth scrolling class to html
  document.documentElement.style.scrollBehavior = 'smooth';
  
  console.log('{{COOPERATIVE_NAME}} website initialized successfully!');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Carousel,
    FormValidator,
    LanguageSwitcher,
    MobileMenu,
    ScrollAnimations,
    NewsFilter
  };
}
