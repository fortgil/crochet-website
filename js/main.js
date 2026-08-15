// ========================================
//  ROSETTE CROCHET — MAIN JAVASCRIPT
// ========================================

const STORAGE_KEY = 'twizie_products';

document.addEventListener('DOMContentLoaded', () => {

  // ── 0a. INITIALIZE DEFAULT PRODUCTS (first time only) ────────────────
  function initDefaultProducts() {
    if (localStorage.getItem(STORAGE_KEY)) return; // already has products
    
    const defaults = [
      // Ready-made products
      {
        id: 'ready_001',
        name: 'Boho Market Bag',
        category: 'bags',
        type: 'ready-made',
        price: 2500,
        description: 'Perfect for every outing. Spacious & stylish.',
        status: 'available',
        stock: 2,
        image: null
      },
      {
        id: 'ready_002',
        name: 'Lace Crop Top',
        category: 'tops', 
        type: 'ready-made',
        price: 3000,
        description: 'Light, elegant, and perfect for summer.',
        status: 'available',
        stock: 1,
        image: null
      },
      {
        id: 'ready_003',
        name: 'Rose Hair Clip',
        category: 'accessories',
        type: 'ready-made', 
        price: 800,
        description: 'Delicate crocheted rose, a sweet touch.',
        status: 'available',
        stock: 3,
        image: null
      },
      // Reference/Custom designs
      {
        id: 'ref_001',
        name: 'Vintage Tote Design',
        category: 'bags',
        type: 'reference',
        price: 3200,
        description: 'Classic tote with intricate stitch patterns. Can be customized in your preferred colors.',
        status: 'custom',
        image: null
      },
      {
        id: 'ref_002',
        name: 'Crochet Strawberry Shrug',
        category: 'tops',
        type: 'reference',
        price: 2500,
        description: 'Adorable strawberry-themed shrug perfect for any occasion. Customize colors to match your style.',
        status: 'custom',
        image: 'images/crochet stoberi shrug.jpg'
      },
      {
        id: 'ref_003',
        name: 'Statement Earring Set',
        category: 'accessories',
        type: 'reference',
        price: 1500,
        description: 'Bold geometric earrings that make an impression. Available in multiple colors.',
        status: 'custom',
        image: null
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }

  // ── 0. LOAD & RENDER PRODUCTS FROM LOCALSTORAGE ──────────────────
  function loadProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const products = data ? JSON.parse(data) : [];
      return products;
    } catch (e) {
      console.error('Error loading products:', e);
      return [];
    }
  }

  function renderProducts() {
    try {
      const products = loadProducts();
      
      const readyMadeGrid = document.getElementById('ready-made-grid');
      const referenceGrid = document.getElementById('reference-grid');
      const readyMadeEmpty = document.getElementById('no-ready-made-state');
      const referenceEmpty = document.getElementById('no-reference-state');

      if (!readyMadeGrid || !referenceGrid) {
        console.error('Product grids not found in DOM');
        return;
      }

      // Separate products by type
      const readyMadeProducts = products.filter(p => p.type === 'ready-made');
      const referenceProducts = products.filter(p => p.type === 'reference');

      // Render Ready-Made Products
      renderProductGrid(readyMadeProducts, readyMadeGrid, readyMadeEmpty, 'ready-made');
      
      // Render Reference Products 
      renderProductGrid(referenceProducts, referenceGrid, referenceEmpty, 'reference');

    } catch (e) {
      console.error('Error rendering products:', e);
    }
  }

  function renderProductGrid(products, grid, emptyState, type) {
    if (products.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = products.map(p => {
      const hasImg = p.image && p.image.startsWith('data:');
      const isLocalImg = p.image && !p.image.startsWith('data:');
      const icon = { bags: '🎒', tops: '👕', accessories: '🌸' }[p.category] || '🧶';
      
      // Button and status based on type
      let buttonText, buttonAction;
      
      if (type === 'ready-made') {
        buttonText = 'Order Now';
        buttonAction = `orderProduct('${p.name}', ${p.price})`;
      } else {
        buttonText = 'Request This Design';
        buttonAction = `requestCustom('${p.name}', ${p.price})`;
      }
      
      return `
        <div class="product-card ${type} fade-in" data-category="${p.category}">
          <div class="product-img-wrap">
            <div class="product-img ${!hasImg && !isLocalImg ? 'placeholder-img' : ''}">
              ${hasImg
                ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius);" />`
                : isLocalImg
                ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius);" />`
                : icon}
            </div>
            <div class="product-overlay">
              <button class="btn btn-primary btn-sm" onclick="${buttonAction}">${buttonText}</button>
            </div>
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <div class="product-price">KSh ${Number(p.price).toLocaleString('en-KE')}</div>
            <p class="product-description">${p.description}</p>
            <div class="product-status-label">${type === 'ready-made' ? '✓ Available' : '🎨 Made on Request'}</div>
          </div>
        </div>
      `;
    }).join('');

    // Re-trigger fade animations
    grid.querySelectorAll('.product-card.fade-in').forEach((el, i) => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = `fadeUp 0.7s ease ${i * 0.08}s forwards`;
    });
  }

  // Filter functions for Ready-Made Products
  window.filterReadyMade = (category) => {
    const products = loadProducts();
    const readyMadeProducts = products.filter(p => p.type === 'ready-made');
    
    const filtered = category === 'all' 
      ? readyMadeProducts
      : readyMadeProducts.filter(p => p.category === category);
    
    const grid = document.getElementById('ready-made-grid');
    const emptyState = document.getElementById('no-ready-made-state');
    
    renderProductGrid(filtered, grid, emptyState, 'ready-made');
    
    // Update active button
    document.querySelectorAll('#ready-made-filter .filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`#ready-made-filter [data-filter="${category}"]`).classList.add('active');
  };

  // Filter functions for Reference Products
  window.filterReference = (category) => {
    const products = loadProducts();
    const referenceProducts = products.filter(p => p.type === 'reference');
    
    const filtered = category === 'all'
      ? referenceProducts
      : referenceProducts.filter(p => p.category === category);
    
    const grid = document.getElementById('reference-grid');
    const emptyState = document.getElementById('no-reference-state');
    
    renderProductGrid(filtered, grid, emptyState, 'reference');
    
    // Update active button
    document.querySelectorAll('#reference-filter .filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`#reference-filter [data-filter="${category}"]`).classList.add('active');
  };

  // Update contact form dropdown
  function updateItemDropdown() {
    try {
      const products = loadProducts();
      const select = document.getElementById('item');
      
      if (!select) {
        console.error('item select not found in DOM');
        return;
      }

      const current = select.value;

      // Clear existing (keep "Select" and "Custom Order")
      const opts = select.querySelectorAll('option');
      opts.forEach(opt => {
        if (opt.value && opt.value !== 'custom') opt.remove();
      });

      // Add ready-made products
      const readyMade = products.filter(p => p.type === 'ready-made');
      readyMade.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `${p.name} (Ready-Made)`;
        select.insertBefore(opt, select.lastElementChild);
      });

      // Add reference designs
      const reference = products.filter(p => p.type === 'reference');
      reference.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `${p.name} (Custom Design)`;
        select.insertBefore(opt, select.lastElementChild);
      });

      if (current) select.value = current;
    } catch (e) {
      console.error('Error updating dropdown:', e);
    }
  }

  // WhatsApp Integration Functions
  window.orderProduct = (productName, price) => {
    const phoneNumber = '254710626156';
    const message = `Hello, I would like to order the ${productName}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  window.requestCustom = (designName, estimatedPrice) => {
    const phoneNumber = '254710626156';
    const message = `Hello, I am interested in the ${designName}. I would like to request a custom order.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Scroll to contact and pre-fill item
  window.scrollToContact = (itemName) => {
    document.getElementById('item').value = itemName;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('name').focus(), 400);
  };

  // ── 1. NAVBAR: scroll effect + active link ──────────────────────────
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // run once on load


  // ── 2. HAMBURGER MENU ───────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });


  // ── 3. FADE-IN ON SCROLL (Intersection Observer) ────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger for grid children
          const delay = entry.target.closest('.products-grid, .about-visual, .contact-grid')
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
            : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeEls.forEach(el => observer.observe(el));


  // ── 5. CONTACT FORM VALIDATION ──────────────────────────────────────
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (field)  field.classList.add('error');
    if (error)  error.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    successMsg.classList.remove('visible');

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid     = true;

    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    }
    if (!email) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!message) {
      showError('message', 'Please write a message.');
      valid = false;
    }

    if (valid) {
      // Simulate sending (replace with real backend/EmailJS/etc.)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        successMsg.classList.add('visible');
        submitBtn.textContent = 'Send Message ✿';
        submitBtn.disabled = false;

        // Hide success message after 6 seconds
        setTimeout(() => successMsg.classList.remove('visible'), 6000);
      }, 1200);
    }
  });

  // Clear error styling on input
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(`${id}-error`);
        if (errEl) errEl.textContent = '';
      });
    }
  });


  // ── 6. SMOOTH SCROLL for hero scroll hint ───────────────────────────
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }


  // ── 6. MAGNETIC BUTTON EFFECT ───────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.28;
      const dy     = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  // ── 7. PRODUCT CARD TILT EFFECT ─────────────────────────────────────
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.product-card').forEach(card => {
      const rect  = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const rotX  = ((y - cy) / cy) * -8;
      const rotY  = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.02)`;
    });
  }, false);

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.transform = '';
    });
  });


  // ── 9. ABOUT CARD GLOW FOLLOW ───────────────────────────────────────
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, #333 0%, var(--mid) 70%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  // ── 8. INIT PRODUCTS ────────────────────────────────────────────────
  // Clear old localStorage to load new products (remove this line after first load)
  localStorage.removeItem(STORAGE_KEY);
  
  initDefaultProducts();
  renderProducts();
  updateItemDropdown();

  // Re-render if localStorage changes (admin made changes or data updated elsewhere)
  window.addEventListener('storage', () => {
    renderProducts();
    updateItemDropdown();
  });

});
