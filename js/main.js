// ========================================
//  ROSETTE CROCHET — MAIN JAVASCRIPT
// ========================================

const STORAGE_KEY = 'twizie_products';

document.addEventListener('DOMContentLoaded', () => {

  // ── 0a. INITIALIZE DEFAULT PRODUCTS ──────────────────────────────────
  function initDefaultProducts() {
    const VERSION = 'v17_rosette';
    const savedVersion = localStorage.getItem('twizie_version');
    const existing = localStorage.getItem(STORAGE_KEY);
    
    const defaults = [
      // Ready-made products
      {
        id: 'ready_001',
        name: 'Rosette Pink Blossom Bag',
        category: 'bags',
        type: 'ready-made',
        price: 1600,
        description: 'Charming cream crochet shoulder bag adorned with vibrant pink granny squares and a matching pink zip closure.',
        status: 'available',
        stock: 2,
        image: 'images/BAG 2.jpg'
      },
      {
        id: 'ready_002',
        name: 'Pink Blossom Mocha Bag',
        category: 'bags',
        type: 'ready-made',
        price: 1600,
        description: 'Delightful blend of soft pink, mocha brown, and cream crochet squares, styled with a cute flower clip.',
        status: 'available',
        stock: 1,
        image: 'images/BAG 4.jpg'
      },
      {
        id: 'ready_003',
        name: 'Black Cherry Chevron Bag',
        category: 'bags',
        type: 'ready-made',
        price: 1600,
        description: 'Striking black and white zigzag crochet bag accented with a cute handmade cherry charm.',
        status: 'available',
        stock: 2,
        image: 'images/BAG 5.jpg'
      },
      {
        id: 'ready_004',
        name: 'Sunset Blossom Tote',
        category: 'bags',
        type: 'ready-made',
        price: 2000,
        description: 'Warm and cozy cream shoulder bag featuring vibrant floral granny squares in sunset orange and red tones.',
        status: 'available',
        stock: 1,
        image: 'images/BAG 1.jpg'
      },
      {
        id: 'ready_005',
        name: 'Mocha Checkered Tote',
        category: 'bags',
        type: 'ready-made',
        price: 2000,
        description: 'Trendy checkerboard pattern in rich mocha brown and cream, sturdy and spacious for everyday outings.',
        status: 'available',
        stock: 2,
        image: 'images/BAG 3.jpg'
      },
      {
        id: 'ready_006',
        name: 'Striped Black Tote',
        category: 'bags',
        type: 'ready-made',
        price: 2000,
        description: 'Bold black-and-white striped crochet tote with elegant contrast lines and comfortable handles.',
        status: 'available',
        stock: 1,
        image: 'images/strip black.jpg'
      },
      {
        id: 'ready_007',
        name: 'Magenta Striped Crop Top',
        category: 'tops',
        type: 'ready-made',
        price: 2500,
        description: 'Stunning magenta pink and black striped crochet top with flattering V-neck cut.',
        status: 'available',
        stock: 1,
        image: 'images/TOP 2.jpg'
      },
      {
        id: 'ready_008',
        name: 'Jellyfish Charm Keychain',
        category: 'accessories',
        type: 'ready-made',
        price: 150,
        description: 'Super cute pink and white crochet jellyfish keychain with ruffled tentacles and pearl accents. Perfect for bags or keys.',
        status: 'available',
        stock: 4,
        image: 'images/jellyfish keychain.jpg'
      },
      {
        id: 'ready_009',
        name: 'Coquette Ruffle Hair Bow',
        category: 'accessories',
        type: 'ready-made',
        price: 800,
        description: 'Delicate baby pink crochet hair bow with ruffled white lace edging. Perfect styling piece for braids, ponytails, or half-up hair.',
        status: 'available',
        stock: 3,
        image: 'images/pink ruffle hair bow.jpg'
      },
      {
        id: 'ready_010',
        name: 'Cozy Ribbed Twist Headbands',
        category: 'accessories',
        type: 'ready-made',
        price: 400,
        description: 'Handmade ribbed twist-knot crochet ear warmer headbands, cozy and stylish in warm autumn tones.',
        status: 'available',
        stock: 6,
        image: 'images/crochet headbands.jpg'
      },
      {
        id: 'ready_011',
        name: 'Cream Ribbon Bow Keychain',
        category: 'accessories',
        type: 'ready-made',
        price: 150,
        description: 'Minimalist cream crochet bow charm with silver keychain ring. Adds a sweet aesthetic touch to any bag or backpack.',
        status: 'available',
        stock: 5,
        image: 'images/cream bow keychain.jpg'
      },
      {
        id: 'ready_012',
        name: 'Crimson Spiderweb Waist Drape',
        category: 'accessories',
        type: 'ready-made',
        price: 600,
        description: 'Edgy crimson-red crochet spiderweb waist scarf/drape with adjustable tie cords. Style it over jeans, skirts, or dresses.',
        status: 'available',
        stock: 2,
        image: 'images/spiderweb hip drape.jpg'
      },
      {
        id: 'ready_013',
        name: 'Ruffle Blossom Scrunchies',
        category: 'accessories',
        type: 'ready-made',
        price: 250,
        description: 'Fluffy ruffled crochet hair scrunchies handmade with soft yarn that protects your hair. Available in dual-tone and pastel colors.',
        status: 'available',
        stock: 6,
        image: 'images/crochet scrunchies.jpg'
      },
      {
        id: 'ready_019',
        name: 'Pastel Tie-Back Headbands',
        category: 'accessories',
        type: 'ready-made',
        price: 150,
        description: 'Handmade ribbed crochet tie-back headbands available in vibrant shades including magenta, royal blue, lavender, pastel yellow, orange, and sky blue.',
        status: 'available',
        stock: 6,
        image: 'images/pastel tie headbands.jpg'
      },
      // Hats & Beanies
      {
        id: 'ready_014',
        name: 'Sky Blue Cat-Ear Beanie',
        category: 'hats',
        type: 'ready-made',
        price: 1500,
        description: 'Super cute pastel sky blue and white granny square cat-ear beanie with a cozy fold-over brim.',
        status: 'available',
        stock: 3,
        image: 'images/cat ear beanie blue.jpg'
      },
      {
        id: 'ready_015',
        name: 'Spider-Man Ribbed Beanie',
        category: 'hats',
        type: 'ready-made',
        price: 1000,
        description: 'Handcrafted crimson-red ribbed beanie featuring bold Spider-Man eye masks in black and white.',
        status: 'available',
        stock: 4,
        image: 'images/spiderman beanie.jpg'
      },
      {
        id: 'ready_016',
        name: 'Sunburst Floral Ruffle Bucket Hat',
        category: 'hats',
        type: 'ready-made',
        price: 2000,
        description: 'Chic cream and sunburst-yellow floral granny square bucket hat with a dramatic wavy ruffle brim.',
        status: 'available',
        stock: 2,
        image: 'images/yellow blossom ruffle bucket hat.jpg'
      },
      {
        id: 'ready_017',
        name: 'Coquette Ruffle Bonnet Bucket Hat',
        category: 'hats',
        type: 'ready-made',
        price: 1800,
        description: 'Romantic flared ruffle brim crochet bonnet hat, available in baby pink and chocolate brown.',
        status: 'available',
        stock: 3,
        image: 'images/ruffle bonnet bucket hats.jpg'
      },
      {
        id: 'ready_018',
        name: 'Slouchy Grey Striped Beanie',
        category: 'hats',
        type: 'ready-made',
        price: 1500,
        description: 'Cozy relaxed-fit slouchy beanie in clean grey and white stripes, perfect for cool days and effortless style.',
        status: 'available',
        stock: 3,
        image: 'images/striped slouchy beanie.jpg'
      },
      // Reference/Custom designs
      {
        id: 'ref_001',
        name: 'Black & White Shrug Sleeves',
        category: 'tops',
        type: 'reference',
        price: 2000,
        description: 'Statement black and white granny square shrug with flared sleeves. Made to your exact measurements.',
        status: 'custom',
        image: 'images/TOP.jpg'
      },
      {
        id: 'ref_002',
        name: 'Spider-Man Wall Tapestry',
        category: 'accessories',
        type: 'reference',
        price: 2500,
        description: 'Custom handcrafted Spider-Man graphic wall hanging for your room or studio. Custom characters available.',
        status: 'custom',
        image: 'images/SPIDER.jpg'
      },
      {
        id: 'ref_003',
        name: 'Orange Black Tote',
        category: 'bags',
        type: 'reference',
        price: 2000,
        description: 'Handcrafted orange and black crochet bag. Custom colorways and sizing available on request.',
        status: 'custom',
        image: 'images/orange black 1.jpg'
      }
    ];

    if (!existing || savedVersion !== VERSION) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      localStorage.setItem('twizie_version', VERSION);
      return;
    }

    try {
      const currentList = JSON.parse(existing);
      let updated = false;
      defaults.forEach(def => {
        const idx = currentList.findIndex(p => p.id === def.id);
        if (idx === -1) {
          currentList.push(def);
          updated = true;
        } else if (!currentList[idx].image && def.image) {
          currentList[idx].image = def.image;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      localStorage.setItem('twizie_version', VERSION);
    }
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
      const icon = { bags: '🎒', tops: '👕', hats: '🧢', accessories: '🌸' }[p.category] || '🧶';
      
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
          <div class="product-img-wrap clickable-image" data-product-id="${p.id}" title="Click to view full photo">
            ${p.image ? `<div class="product-zoom-badge">🔍 View Full</div>` : ''}
            <div class="product-img ${!hasImg && !isLocalImg ? 'placeholder-img' : ''}">
              ${hasImg || isLocalImg
                ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius);" loading="lazy" />`
                : icon}
            </div>
            <div class="product-overlay" onclick="event.stopPropagation()">
              <button class="btn btn-primary btn-sm" onclick="${buttonAction}">${buttonText}</button>
            </div>
          </div>
          <div class="product-info">
            <h3 data-product-id="${p.id}" class="clickable-title" style="cursor:pointer;" title="Click to view photo">${p.name}</h3>
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
  initDefaultProducts();
  renderProducts();
  updateItemDropdown();

  async function syncProductsFromSupabase() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Live sync error:', error);
        return;
      }

      if (data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        renderProducts();
        updateItemDropdown();
        console.log('[Supabase] Products synced live from cloud:', data.length);
      }
    } catch (err) {
      console.warn('[Supabase] Sync failed:', err);
    }
  }

  syncProductsFromSupabase();

  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    try {
      supabaseClient
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          syncProductsFromSupabase();
        })
        .subscribe();
    } catch (e) {
      console.warn('[Supabase] Realtime error:', e);
    }
  }

  // ── 10. FAQ ACCORDION ───────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close other open items
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      
      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ── 11. LIGHTBOX MODAL ──────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxPrice = document.getElementById('lightbox-price');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxOrderBtn = document.getElementById('lightbox-order-btn');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');

  window.openProductLightbox = (productId) => {
    const products = loadProducts();
    const p = products.find(prod => prod.id === productId);
    if (!p || !p.image) return;

    if (lightboxImg) {
      lightboxImg.src = p.image;
      lightboxImg.alt = p.name;
    }
    if (lightboxTitle) lightboxTitle.textContent = p.name;
    if (lightboxPrice) lightboxPrice.textContent = `KSh ${Number(p.price).toLocaleString('en-KE')}`;
    if (lightboxDesc) lightboxDesc.textContent = p.description;

    if (lightboxOrderBtn) {
      if (p.type === 'ready-made') {
        lightboxOrderBtn.textContent = 'Order on WhatsApp ✿';
        lightboxOrderBtn.onclick = () => orderProduct(p.name, p.price);
      } else {
        lightboxOrderBtn.textContent = 'Request Custom Design ✿';
        lightboxOrderBtn.onclick = () => requestCustom(p.name, p.price);
      }
    }

    if (lightbox) {
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  };

  function closeLightbox() {
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── 9. PROGRESSIVE WEB APP (PWA) SUPPORT ───────────────────────────
  let deferredPrompt = null;
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaInstallBtn = document.getElementById('pwa-install-action');
  const pwaDismissBtn = document.getElementById('pwa-dismiss-action');
  const navInstallBtn = document.getElementById('nav-install-btn');

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // Handle Before Install Prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (navInstallBtn) navInstallBtn.style.display = 'inline-flex';

    if (!sessionStorage.getItem('twizie_pwa_dismissed')) {
      setTimeout(() => {
        if (pwaBanner && deferredPrompt) {
          pwaBanner.classList.add('show');
        }
      }, 3000);
    }
  });

  async function triggerInstallPrompt() {
    if (!deferredPrompt) {
      alert("To install Twizie Crochet on iPhone/iPad: Tap the Share button in Safari, then select 'Add to Home Screen' ✿");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
    if (pwaBanner) pwaBanner.classList.remove('show');
    if (navInstallBtn) navInstallBtn.style.display = 'none';
  }

  if (pwaInstallBtn) pwaInstallBtn.addEventListener('click', triggerInstallPrompt);
  if (navInstallBtn) navInstallBtn.addEventListener('click', triggerInstallPrompt);

  if (pwaDismissBtn) {
    pwaDismissBtn.addEventListener('click', () => {
      if (pwaBanner) pwaBanner.classList.remove('show');
      sessionStorage.setItem('twizie_pwa_dismissed', 'true');
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed!');
    deferredPrompt = null;
    if (pwaBanner) pwaBanner.classList.remove('show');
    if (navInstallBtn) navInstallBtn.style.display = 'none';
  });

});








