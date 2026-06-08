document.addEventListener('DOMContentLoaded', () => {
  // --- 1. SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- 2. PRODUCT SPECIFICATION TABS ---
  const productCards = document.querySelectorAll('[data-product-card]');
  
  productCards.forEach(card => {
    const tabs = card.querySelectorAll('[data-tab]');
    const panes = card.querySelectorAll('[data-pane]');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPane = tab.getAttribute('data-tab');
        
        // Update active tab styles
        tabs.forEach(t => {
          if (t === tab) {
            t.classList.add('border-cyan-500', 'text-cyan-400');
            t.classList.remove('border-transparent', 'text-gray-400');
          } else {
            t.classList.remove('border-cyan-500', 'text-cyan-400');
            t.classList.add('border-transparent', 'text-gray-400');
          }
        });
        
        // Toggle corresponding panes
        panes.forEach(pane => {
          if (pane.getAttribute('data-pane') === targetPane) {
            pane.classList.remove('hidden');
            pane.classList.add('fade-in');
          } else {
            pane.classList.add('hidden');
            pane.classList.remove('fade-in');
          }
        });
      });
    });
  });

  // --- 3. TESTIMONIAL SLIDER ---
  const sliderTrack = document.querySelector('[data-slider-track]');
  const slides = document.querySelectorAll('[data-slide]');
  const prevBtn = document.querySelector('[data-slider-prev]');
  const nextBtn = document.querySelector('[data-slider-next]');
  const indicatorContainer = document.querySelector('[data-slider-indicators]');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval;
  
  if (sliderTrack && slides.length > 0) {
    // Generate indicators dynamically
    slides.forEach((_, index) => {
      const button = document.createElement('button');
      button.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-cyan-500 w-6' : 'bg-gray-600 hover:bg-gray-400'}`;
      button.setAttribute('aria-label', `Go to slide ${index + 1}`);
      button.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      indicatorContainer.appendChild(button);
    });
    
    const indicators = indicatorContainer.querySelectorAll('button');
    
    function updateSlider() {
      // Shift the slider track
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update indicators
      indicators.forEach((ind, index) => {
        if (index === currentSlide) {
          ind.classList.add('bg-cyan-500', 'w-6');
          ind.classList.remove('bg-gray-600');
        } else {
          ind.classList.remove('bg-cyan-500', 'w-6');
          ind.classList.add('bg-gray-600');
        }
      });
    }
    
    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    }
    
    // Bind buttons
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    
    // Autoplay setup
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }
    
    // Pause slider on hover
    const sliderContainer = document.querySelector('[data-slider-container]');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      sliderContainer.addEventListener('mouseleave', startAutoplay);
    }
    
    startAutoplay();
  }

  // --- 4. PRICING BILLING CYCLE TOGGLE ---
  const billingToggle = document.getElementById('billing-toggle');
  const priceStarter = document.getElementById('price-starter');
  const priceProfessional = document.getElementById('price-professional');
  const periodStarter = document.getElementById('period-starter');
  const periodProfessional = document.getElementById('period-professional');
  
  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      
      // Animate transition
      [priceStarter, priceProfessional].forEach(priceEl => {
        priceEl.classList.add('scale-90', 'opacity-0');
      });
      
      setTimeout(() => {
        if (isAnnual) {
          priceStarter.textContent = '$39';
          priceProfessional.textContent = '$119';
          periodStarter.textContent = '/mo, billed annually';
          periodProfessional.textContent = '/mo, billed annually';
        } else {
          priceStarter.textContent = '$49';
          priceProfessional.textContent = '$149';
          periodStarter.textContent = '/month';
          periodProfessional.textContent = '/month';
        }
        
        [priceStarter, priceProfessional].forEach(priceEl => {
          priceEl.classList.remove('scale-90', 'opacity-0');
          priceEl.classList.add('scale-100', 'opacity-100');
        });
      }, 200);
    });
  }

  // --- 5. CONTACT FORM HANDLER ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Verification states
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Securing Uplink...
      `;
      
      // Simulate API submit latency
      setTimeout(() => {
        // Swap to success presentation
        submitBtn.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'hover:opacity-90');
        submitBtn.classList.add('bg-emerald-600');
        submitBtn.innerHTML = `
          <svg class="h-5 w-5 text-white mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
          Uplink Established (Success)
        `;
        
        contactForm.reset();
        
        // Reset button after 4 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-emerald-600');
          submitBtn.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'hover:opacity-90');
          submitBtn.innerHTML = originalText;
        }, 4000);
        
      }, 1800);
    });
  }

  // --- 6. NEWSLETTER SIGNUP HANDLER ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      
      if (!emailInput.value) return;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;
      
      setTimeout(() => {
        emailInput.disabled = true;
        submitBtn.innerHTML = `
          <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
        
        setTimeout(() => {
          emailInput.disabled = false;
          emailInput.value = '';
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg class="w-4 h-4 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          `;
        }, 3000);
      }, 1200);
    });
  }
});
