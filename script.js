// Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navbarToggle = document.getElementById('navbarToggle');
    this.navbarMenu = document.getElementById('navbarMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    // Mobile menu toggle
    this.navbarToggle.addEventListener('click', () => {
      this.navbarMenu.classList.toggle('navbar-menu-active');
    });
    
    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navbarMenu.classList.remove('navbar-menu-active');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.navbarMenu.classList.remove('navbar-menu-active');
      }
    });
    
    // Highlight active nav link on scroll
    this.handleScrollNavigation();
  }
  
  handleScrollNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }
  
  handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert('Please fill in all fields.');
      return;
    }
    
    if (!this.isValidEmail(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Simulate form submission
    const button = this.form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Sending...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      alert('Thank you for your message! I\'ll get back to you soon.');
      this.form.reset();
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Spotify-like Portfolio Interface
class SpotifyPortfolio {
  constructor() {
    this.currentSection = 'search';
    this.searchData = this.initializeSearchData();
    this.init();
  }
  
  init() {
    this.setupNavigation();
    this.setupSearch();
    this.setupTopBarButtons();
    this.setupProjectInteractions();
    this.setupContactForm();
    this.setupBrowseCards();
  }
  
  // Initialize search data for filtering
  initializeSearchData() {
    return {
      about: {
        title: 'About Michael',
        content: 'IT professional hospital automation enterprise device management web development',
        section: 'about'
      },
      projects: {
        title: 'Featured Projects',
        content: 'mansion sea cafe pescado marriages foundation website development',
        section: 'projects'
      },
      skills: {
        title: 'Technical Skills',
        content: 'html css javascript wix wordpress intune sccm power bi automation',
        section: 'skills'
      },
      contact: {
        title: 'Contact Information',
        content: 'email discord hire collaboration consulting',
        section: 'contact'
      },
      automation: {
        title: 'IT Automation',
        content: 'intune sccm enterprise device management workflow automation',
        section: 'skills'
      },
      experience: {
        title: 'Professional Experience',
        content: 'hospital IT website management business founder',
        section: 'about'
      }
    };
  }
  
  // Setup sidebar navigation
  setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        this.switchSection(section);
        this.updateActiveMenuItem(item);
      });
    });
  }
  
  // Switch between content sections
  switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionName;
    }
  }
  
  // Update active menu item
  updateActiveMenuItem(activeItem) {
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');
  }
  
  // Setup search functionality
  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length > 0) {
        clearButton.classList.add('show');
        this.performSearch(query);
      } else {
        clearButton.classList.remove('show');
        this.showDefaultBrowse();
      }
    });
    
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearButton.classList.remove('show');
      this.showDefaultBrowse();
      searchInput.focus();
    });
    
    // Show search section when clicking in search box
    searchInput.addEventListener('focus', () => {
      this.switchSection('search');
      this.updateActiveMenuItem(document.querySelector('[data-section="search"]'));
    });
  }
  
  // Perform search and display results
  performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const results = [];
    
    // Search through data
    Object.keys(this.searchData).forEach(key => {
      const item = this.searchData[key];
      if (item.content.toLowerCase().includes(query) || 
          item.title.toLowerCase().includes(query)) {
        results.push(item);
      }
    });
    
    // Also search browse cards
    const browseCards = document.querySelectorAll('.browse-card');
    browseCards.forEach(card => {
      const searchTerms = card.getAttribute('data-search');
      if (searchTerms && searchTerms.toLowerCase().includes(query)) {
        const title = card.querySelector('h3').textContent;
        const section = this.getSectionFromCard(card);
        results.push({ title, section, isCard: true, element: card });
      }
    });
    
    this.displaySearchResults(results, query);
  }
  
  // Display search results
  displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="no-results">
          <h3>No results found</h3>
          <p>Try searching for "projects", "skills", "contact", or "automation"</p>
        </div>
      `;
      return;
    }
    
    let html = '<div class="browse-grid">';
    
    results.forEach(result => {
      if (result.isCard) {
        // Clone the original card
        html += result.element.outerHTML;
      } else {
        // Create result card
        const color = this.getColorForSection(result.section);
        html += `
          <div class="browse-card" style="background: ${color};" data-section="${result.section}">
            <h3>${result.title}</h3>
            <div class="card-icon">
              <i class="${this.getIconForSection(result.section)}"></i>
            </div>
          </div>
        `;
      }
    });
    
    html += '</div>';
    searchResults.innerHTML = html;
    
    // Add click handlers to result cards
    this.setupBrowseCards();
  }
  
  // Show default browse cards
  showDefaultBrowse() {
    const searchResults = document.getElementById('searchResults');
    const defaultGrid = `
      <div class="browse-grid">
        <div class="browse-card" style="background: linear-gradient(135deg, #1db954, #1ed760);" data-search="about experience" data-section="about">
          <h3>About Me</h3>
          <div class="card-icon">
            <i class="fas fa-user"></i>
          </div>
        </div>
        
        <div class="browse-card" style="background: linear-gradient(135deg, #e22134, #ff6b6b);" data-search="projects portfolio work" data-section="projects">
          <h3>My Projects</h3>
          <div class="card-icon">
            <i class="fas fa-folder-open"></i>
          </div>
        </div>
        
        <div class="browse-card" style="background: linear-gradient(135deg, #ff6600, #ff8c42);" data-search="skills tech stack" data-section="skills">
          <h3>Technical Skills</h3>
          <div class="card-icon">
            <i class="fas fa-code"></i>
          </div>
        </div>
        
        <div class="browse-card" style="background: linear-gradient(135deg, #8e44ad, #a569bd);" data-search="experience work history" data-section="about">
          <h3>Experience</h3>
          <div class="card-icon">
            <i class="fas fa-briefcase"></i>
          </div>
        </div>
        
        <div class="browse-card" style="background: linear-gradient(135deg, #2980b9, #3498db);" data-search="contact hire email" data-section="contact">
          <h3>Contact Me</h3>
          <div class="card-icon">
            <i class="fas fa-envelope"></i>
          </div>
        </div>
        
        <div class="browse-card" style="background: linear-gradient(135deg, #f39c12, #f1c40f);" data-search="automation intune sccm" data-section="skills">
          <h3>IT Automation</h3>
          <div class="card-icon">
            <i class="fas fa-cogs"></i>
          </div>
        </div>
      </div>
    `;
    
    searchResults.innerHTML = defaultGrid;
    this.setupBrowseCards();
  }
  
  // Setup browse card interactions
  setupBrowseCards() {
    const browseCards = document.querySelectorAll('.browse-card');
    
    browseCards.forEach(card => {
      card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        if (section) {
          this.switchSection(section);
          this.updateActiveMenuItem(document.querySelector(`[data-section="${section}"]`));
        }
      });
    });
  }
  
  // Setup top bar navigation buttons
  setupTopBarButtons() {
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    
    // Simple back/forward simulation
    backBtn.addEventListener('click', () => {
      // Could implement history navigation here
      console.log('Back clicked');
    });
    
    forwardBtn.addEventListener('click', () => {
      // Could implement history navigation here
      console.log('Forward clicked');
    });
  }
  
  // Setup project interactions
  setupProjectInteractions() {
    const projectItems = document.querySelectorAll('.project-item');
    const projectUrls = {
      'The Mansion on the Sea': 'https://themansiononthesea.com',
      'Seaside Café Key West': 'https://seasidecafekw.com',
      'Pescado Key West': 'https://pescadokw.com',
      'Mansion Marriages': 'https://mansionmarriages.com',
      'Michelle Foundation': 'https://michellefoundation.com'
    };
    
    projectItems.forEach(item => {
      const playBtn = item.querySelector('.play-btn');
      const projectName = item.querySelector('h3').textContent;
      
      if (playBtn && projectUrls[projectName]) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(projectUrls[projectName], '_blank');
        });
      }
      
      // Make entire item clickable
      item.addEventListener('click', () => {
        if (projectUrls[projectName]) {
          window.open(projectUrls[projectName], '_blank');
        }
      });
    });
  }
  
  // Setup contact form
  setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit(form);
      });
    }
  }
  
  // Handle contact form submission
  handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      this.showNotification('Please fill in all fields.', 'error');
      return;
    }
    
    if (!this.isValidEmail(data.email)) {
      this.showNotification('Please enter a valid email address.', 'error');
      return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }
  
  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#1db954' : type === 'error' ? '#e22134' : '#2980b9'};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Utility functions
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  getSectionFromCard(card) {
    const searchTerms = card.getAttribute('data-search');
    if (searchTerms.includes('about') || searchTerms.includes('experience')) return 'about';
    if (searchTerms.includes('projects') || searchTerms.includes('portfolio')) return 'projects';
    if (searchTerms.includes('skills') || searchTerms.includes('tech')) return 'skills';
    if (searchTerms.includes('contact') || searchTerms.includes('email')) return 'contact';
    return 'about';
  }
  
  getColorForSection(section) {
    const colors = {
      about: 'linear-gradient(135deg, #1db954, #1ed760)',
      projects: 'linear-gradient(135deg, #e22134, #ff6b6b)',
      skills: 'linear-gradient(135deg, #ff6600, #ff8c42)',
      contact: 'linear-gradient(135deg, #2980b9, #3498db)'
    };
    return colors[section] || colors.about;
  }
  
  getIconForSection(section) {
    const icons = {
      about: 'fas fa-user',
      projects: 'fas fa-folder-open',
      skills: 'fas fa-code',
      contact: 'fas fa-envelope'
    };
    return icons[section] || icons.about;
  }
}

// Mobile responsiveness
class MobileHandler {
  constructor() {
    this.setupMobileMenu();
    this.handleResize();
  }
  
  setupMobileMenu() {
    // Add mobile menu toggle if needed
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Close sidebar when clicking on main content on mobile
    if (window.innerWidth <= 768) {
      mainContent.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    }
  }
  
  handleResize() {
    window.addEventListener('resize', () => {
      // Handle responsive changes
      if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('sidebar-open');
      }
    });
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ContactForm();
  new SpotifyPortfolio();
  new MobileHandler();
});

// Modern Portfolio JavaScript - Michael Sanchez
document.addEventListener('DOMContentLoaded', function() {
    console.log('🕷️ Michael Sanchez Portfolio - Loading...');

    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const themeMessage = document.getElementById('theme-message');
    const avatarCircle = document.getElementById('avatar-circle');
    const logoText = document.getElementById('logo-text');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // Check if essential elements exist
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }

    if (!scrollIndicator) {
        console.error('Scroll indicator not found!');
        return;
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        function toggleMobileMenu() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }

        // Add both click and touchend events for hamburger
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            function closeMobileMenu() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }

            link.addEventListener('click', closeMobileMenu);
            link.addEventListener('touchend', function(e) {
                e.preventDefault();
                closeMobileMenu();
                // Still trigger the link navigation
                setTimeout(() => {
                    link.click();
                }, 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Dark/Light mode toggle with messages
    function handleThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Show theme message
        showThemeMessage(newTheme);
        
        // Add a subtle animation to the toggle
        themeToggle.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    }

    // Add both click and touchend events for better mobile support
    themeToggle.addEventListener('click', handleThemeToggle);
    themeToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleThemeToggle();
    });

    // Show theme toggle message
    function showThemeMessage(theme) {
        if (!themeMessage) return;
        
        const messages = {
            'dark': 'Welcome to the dark side 🌒',
            'light': 'Let there be light! ☀️'
        };
        
        themeMessage.textContent = messages[theme] || 'Theme switched!';
        themeMessage.className = `theme-message ${theme}-mode show`;
        
        setTimeout(() => {
            themeMessage.classList.remove('show');
        }, 2000);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Easter Egg - Michael Mode (click avatar 5 times)
    let avatarClicks = 0;
    let michaelModeActive = false;
    
    if (avatarCircle) {
        avatarCircle.addEventListener('click', function() {
            avatarClicks++;
            
            if (avatarClicks === 5 && !michaelModeActive) {
                activateMichaelMode();
            }
            
            // Reset counter after 3 seconds of no clicks
            setTimeout(() => {
                if (avatarClicks < 5) {
                    avatarClicks = 0;
                }
            }, 3000);
        });
    }

    function activateMichaelMode() {
        michaelModeActive = true;
        document.body.classList.add('michael-mode');
        if (avatarCircle) avatarCircle.classList.add('michael-mode');
        
        showNotification('🕷️ Michael Mode Activated! Press "M" to toggle.', 'success');
        
        // Auto-deactivate after 10 seconds
        setTimeout(() => {
            if (michaelModeActive) {
                deactivateMichaelMode();
            }
        }, 10000);
    }

    function deactivateMichaelMode() {
        michaelModeActive = false;
        document.body.classList.remove('michael-mode');
        if (avatarCircle) avatarCircle.classList.remove('michael-mode');
        showNotification('Michael Mode Deactivated', 'info');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'M' for Michael Mode toggle
        if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
            if (!isTyping()) {
                e.preventDefault();
                if (michaelModeActive) {
                    deactivateMichaelMode();
                } else {
                    activateMichaelMode();
                }
            }
        }
        
        // Press 'T' for theme toggle
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey) {
            if (!isTyping()) {
                e.preventDefault();
                themeToggle.click();
            }
        }
        
        // Press 'C' to scroll to contact
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.altKey) {
            if (!isTyping()) {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    // Check if user is typing in an input field
    function isTyping() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.isContentEditable
        );
    }

    // Logo click easter egg
    if (logoText) {
        logoText.addEventListener('click', function() {
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 500);
            
            showNotification('SpiderGaming in the house! 🕷️', 'info');
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(0, 0, 0, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
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

    window.addEventListener('scroll', updateActiveNavLink);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced scroll indicator functionality
    if (scrollIndicator) {
        function handleScrollClick() {
            // Add click effect
            scrollIndicator.classList.add('clicked');
            
            // Remove click effect after animation
            setTimeout(() => {
                scrollIndicator.classList.remove('clicked');
            }, 600);
            
            // Smooth scroll to about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Show fun notification
            showNotification('Welcome to my digital web! 🕸️', 'info');
        }

        // Add both click and touchend events for better mobile support
        scrollIndicator.addEventListener('click', handleScrollClick);
        scrollIndicator.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleScrollClick();
        });
        
        // Hide scroll indicator when scrolling past hero
        window.addEventListener('scroll', function() {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                const scrollPosition = window.scrollY;
                
                if (scrollPosition > heroHeight * 0.8) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
                } else {
                    scrollIndicator.style.opacity = '1';
                    // Check if mobile to maintain proper transform
                    if (window.innerWidth <= 480) {
                        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
                    } else {
                        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
                    }
                }
            }
        });
        
        // Special hover effect for spider web
        scrollIndicator.addEventListener('mouseenter', function() {
            // Random chance to show SpiderGaming message
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    showNotification('🕷️ SpiderGaming detected!', 'info');
                }, 500);
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill bars when skills section comes into view
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Observe sections for animation
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Skill bars animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Message sent! I\'ll get back to you within 24 hours. 🚀', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    // Typing effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconMap[type]}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--bg-white);
            border: 1px solid var(--border-light);
            border-left: 4px solid var(--primary-color);
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            z-index: 1002;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-dark);
            font-weight: 500;
        `;
        
        const icon = notification.querySelector('i');
        icon.style.color = type === 'success' ? '#10b981' : 'var(--primary-color)';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Enhanced floating card interactions
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const messages = [
                'HTML5 - The foundation of every web! 🕸️',
                'CSS3 - Weaving beautiful designs since forever ✨',
                'JavaScript - Where the digital magic happens 🎭',
                'WordPress - Building sites that clients love ❤️'
            ];
            
            showNotification(messages[index], 'info');
        });
    });

    // Initialize skill bars width to 0
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });

    // Show keyboard shortcuts hint after 30 seconds
    setTimeout(() => {
        showNotification('💡 Pro tip: Press "M" for Michael Mode, "T" to toggle theme!', 'info');
    }, 30000);

    console.log('🕷️ Michael Sanchez Portfolio - Loaded and ready!');
    console.log('🎮 Easter eggs: Click avatar 5 times, press "M" for Michael Mode!');
});

// Handle window resize
window.addEventListener('resize', () => {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    }
});

// Add CSS animations
const animationStyles = `
  .hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);