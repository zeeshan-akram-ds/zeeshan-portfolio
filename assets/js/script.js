// ===== GLOBAL VARIABLES =====
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeTypedText();
    initializeScrollAnimations();
    initializeProjectFilters();

    // NEW: Initialize the More Projects toggle
    initializeMoreProjectsToggle(); 

    initializeContactForm();
    initializeBackToTop();
    initializeSmoothScrolling();
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});


AOS.init({
  duration: 800,
  once: true
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Set initial theme
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = currentTheme === 'dark' 
                ? 'rgba(17, 24, 39, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = currentTheme === 'dark' 
                ? 'rgba(17, 24, 39, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Active section highlighting
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
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

// ===== TYPED TEXT ANIMATION =====
function initializeTypedText() {
    const typedElement = document.getElementById('typed-text');
    
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Data Science Enthusiast',
                'Machine Learning Engineer',
                'Python Developer',
                'Data Analyst',
                'Problem Solver'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
}

// ===== PROJECT FILTERS (FINAL FIX: AOS CONFLICT RESOLUTION) =====
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 1. Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 2. Filter projects with animation
            projectCards.forEach(card => {
                const categoriesString = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || (categoriesString && categoriesString.includes(filter));

                if (shouldShow) {
                    // FIX 1: Restore display to 'grid' to maintain CSS grid layout
                    card.style.display = 'grid'; 

                    // FIX 2: TEMPORARILY REMOVE AOS ATTRIBUTE TO PREVENT CONFLICT
                    if (card.hasAttribute('data-aos')) {
                        // Store original AOS type before removing it
                        card.setAttribute('data-aos-original', card.getAttribute('data-aos'));
                        card.removeAttribute('data-aos');
                    }
                    
                    // FIX 3: Reset animation (Crucial for re-triggering the fade-in effect)
                    card.style.animation = 'none'; 
                    card.offsetHeight; // Force reflow
                    
                    // 4. Apply fade-in animation and ensure visibility
                    card.style.opacity = '1'; // Force opacity 1 to override AOS conflicts
                    card.style.animation = 'fadeInUp 0.6s ease-in-out';

                } else {
                    // 1. Apply fade-out animation
                    card.style.animation = 'fadeOut 0.3s ease-in-out';
                    
                    // 2. Hide the card AFTER the fade-out animation completes
                    setTimeout(() => {
                        card.style.display = 'none';
                        
                        // RESTORE AOS ATTRIBUTE AFTER HIDING 
                        // This allows AOS to manage the card if 'all' is clicked later
                        if (card.hasAttribute('data-aos-original')) {
                             card.setAttribute('data-aos', card.getAttribute('data-aos-original'));
                             card.removeAttribute('data-aos-original');
                        }
                    }, 300);
                }
            });
        });
    });
}
// =======================================================================
// ===== CONTACT FORM (UPDATED for AJAX/Formspree Submission) =====
// =======================================================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // This is your existing showNotification function, ensuring it's available
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    // Ensure the form action attribute is present for the fetch URL
    const formUrl = contactForm ? contactForm.getAttribute('action') : null;
    
    if (contactForm && formUrl) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // <-- STILL NECESSARY TO PREVENT BROWSER REDIRECT

            // Get form data and elements
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Start loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // *** FETCH API SUBMISSION TO FORMSPREE ***
            fetch(formUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    // This header is required by Formspree for AJAX submissions
                    'Accept': 'application/json' 
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Message sent successfully! Thank you.', 'success');
                    contactForm.reset(); // Reset form on success
                } else {
                    // Handle errors from Formspree (e.g., rate limit, required field missing)
                    response.json().then(data => {
                        if (data && data.errors) {
                            showNotification(data.errors.map(error => error.message).join(", "), 'error');
                        } else {
                            // General failure (e.g., 400 bad request)
                            showNotification('Failed to send message. Please check the Formspree console.', 'error');
                        }
                    })
                }
            })
            .catch(error => {
                // Handle network errors
                showNotification('A network error occurred. Please check your connection.', 'error');
                console.error('Submission Error:', error);
            })
            .finally(() => {
                // Restore button state regardless of success or failure
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
            // *** END FETCH API SUBMISSION ***
        });
    }
}

// Call the function to initialize the form (ensure this is done after the DOM loads)
document.addEventListener('DOMContentLoaded', initializeContactForm);


// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
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
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    highlightActiveSection();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        './assets/images/hero-image.jpg',
        './assets/images/project-1.jpg',
        './assets/images/project-2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation for project cards
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('project-card')) {
            const link = focusedElement.querySelector('.project-link');
            if (link) {
                link.click();
            }
        }
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            // Focus first menu item when menu opens
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    });
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You could send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== ANALYTICS & TRACKING =====

// Track user interactions (placeholder for analytics)
function trackEvent(eventName, eventData) {
    // This is where you would send data to your analytics service
    console.log('Event tracked:', eventName, eventData);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_location: e.target.closest('section')?.id || 'unknown'
        });
    }
});

// Track project card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.project-card')) {
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title')?.textContent;
        trackEvent('project_view', {
            project_name: projectTitle
        });
    }
});

// ===== PROGRESSIVE ENHANCEMENT =====

// Check for JavaScript support and add class
document.documentElement.classList.add('js-enabled');

// Feature detection
const features = {
    intersectionObserver: 'IntersectionObserver' in window,
    webp: false,
    localStorage: typeof Storage !== 'undefined'
};

// WebP support detection
function checkWebPSupport() {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
        features.webp = (webP.height === 2);
        if (features.webp) {
            document.documentElement.classList.add('webp-support');
        }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

checkWebPSupport();

// ===== SERVICE WORKER REGISTRATION =====

// Register service worker for PWA functionality (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeNavigation,
        initializeProjectFilters,
        isValidEmail,
        debounce,
        throttle
    };
}

function initializeMoreProjectsToggle() {
  const toggleButton = document.getElementById('toggle-more-projects');
  const hideButton = document.getElementById('hide-more-projects');
  const detailSection = document.getElementById('more-projects-details');

  if (!toggleButton || !detailSection) return;

  function toggleSection() {
    const isCollapsed = detailSection.classList.contains('collapsed');

    if (isCollapsed) {
      // SHOW section
      detailSection.classList.remove('collapsed');
      toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse Projects';
      detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // HIDE section
      detailSection.classList.add('collapsed');
      toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> View 14 More Projects';
    }
  }

  toggleButton.addEventListener('click', toggleSection);
  if (hideButton) hideButton.addEventListener('click', toggleSection);
}