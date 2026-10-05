// ========================================================
//  TWIZIE | ROSETTE CROCHET — ADMIN JAVASCRIPT
// ========================================================

const ADMIN_PASS = 'twizie2026';
let allProducts = [];
let currentFilter = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. AUTHENTICATION / PIN PROTECTION ────────────────────────────
  const loginScreen = document.getElementById('admin-login-screen');
  const loginForm = document.getElementById('admin-login-form');
  const passInput = document.getElementById('admin-password-input');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');

  function checkAuth() {
    const isAuth = sessionStorage.getItem('twizie_admin_auth') === 'true';
    if (isAuth) {
      if (loginScreen) loginScreen.style.display = 'none';
      loadProductsList();
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (passInput) passInput.focus();
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = passInput.value.trim();
      if (entered === ADMIN_PASS || entered === 'twizie' || entered === 'peace') {
        sessionStorage.setItem('twizie_admin_auth', 'true');
        loginError.style.display = 'none';
        loginScreen.style.display = 'none';
        showToast('✿ Welcome, Twizie!');
        loadProductsList();
      } else {
        loginError.style.display = 'block';
        passInput.value = '';
        passInput.focus();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('twizie_admin_auth');
      checkAuth();
    });
  }

  // ── 2. DATA LOADING FROM SUPABASE (WITH FALLBACK) ──────────────────
  async function loadProductsList() {
    showToast('Loading products...');
    let products = [];

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[Supabase] Error fetching products:', error);
        } else if (data && data.length > 0) {
          products = data;
        }
      } catch (err) {
        console.warn('[Supabase] Fetch error:', err);
      }
    }

    // Fallback to localStorage if Supabase has 0 rows or is offline
    if (!products || products.length === 0) {
      const local = localStorage.getItem('twizie_products');
      if (local) {
        try { products = JSON.parse(local); } catch(e){}
      }
    }

    allProducts = products;
    updateStats();
    renderProducts();
  }

  // ── 3. UPDATE STATS COUNTERS ──────────────────────────────────────
  function updateStats() {
    const statTotal = document.getElementById('stat-total');
    const statBags = document.getElementById('stat-bags');
    const statHats = document.getElementById('stat-hats');
    const statAcc = document.getElementById('stat-accessories');

    if (statTotal) statTotal.textContent = allProducts.length;
    if (statBags) statBags.textContent = allProducts.filter(p => p.category === 'bags').length;
    if (statHats) statHats.textContent = allProducts.filter(p => p.category === 'hats').length;
    if (statAcc) statAcc.textContent = allProducts.filter(p => p.category === 'accessories').length;
  }

  // ── 4. RENDER PRODUCT CARDS ────────────────────────────────────────
  const grid = document.getElementById('product-admin-grid');

  function renderProducts() {
    if (!grid) return;

    let filtered = allProducts.filter(p => {
      const matchesCat = currentFilter === 'all' || p.category === currentFilter;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📦</div>
          <h3>No products found</h3>
          <p>Try clearing your search or add a new product.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isCustom = p.type === 'reference';
      const statusClass = p.status || 'available';
      const statusLabel = statusClass === 'sold-out' ? 'Sold Out' : (statusClass === 'custom' ? 'Custom Order' : 'Available');

      return `
        <div class="admin-prod-card" data-id="${p.id}">
          <div class="card-img-wrap">
            <img src="${p.image || 'images/BAG 2.jpg'}" alt="${p.name}" onerror="this.src='images/BAG 2.jpg';" />
            <span class="card-type-badge">${isCustom ? 'Custom Reference' : 'Ready-Made'}</span>
            <span class="card-status-badge ${statusClass}">${statusLabel}</span>
          </div>
          <div class="card-body">
            <h4 class="card-title">${p.name}</h4>
            <p class="card-desc">${p.description || 'Handmade crochet piece'}</p>

            <div class="card-edit-row">
              <div class="quick-price-box">
                <label>KSh</label>
                <input type="number" class="quick-price-input" id="price-${p.id}" value="${p.price}" min="0" step="50" />
              </div>
              <div class="quick-stock-box">
                <label>Stock</label>
                <input type="number" class="quick-stock-input" id="stock-${p.id}" value="${p.stock || 1}" min="0" />
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-save-row" onclick="quickSaveProduct('${p.id}')">💾 Save</button>
              <button class="btn-outline btn-sm" onclick="editProductModal('${p.id}')">✏️ Edit</button>
              <button class="btn-del-row" onclick="deleteProduct('${p.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── 5. QUICK SAVE PRICE & STOCK INLINE ─────────────────────────────
  window.quickSaveProduct = async (id) => {
    const priceInput = document.getElementById(`price-${id}`);
    const stockInput = document.getElementById(`stock-${id}`);
    if (!priceInput) return;

    const newPrice = Number(priceInput.value);
    const newStock = stockInput ? Number(stockInput.value) : 1;
    const newStatus = newStock <= 0 ? 'sold-out' : 'available';

    // Update local state
    const p = allProducts.find(item => item.id === id);
    if (p) {
      p.price = newPrice;
      p.stock = newStock;
      if (p.type !== 'reference') p.status = newStatus;
    }

    // Save to Supabase
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('products')
          .update({ price: newPrice, stock: newStock, status: p ? p.status : newStatus })
          .eq('id', id);

        if (error) {
          console.error('[Supabase] Error saving:', error);
          showToast('⚠️ Error saving to Supabase. Check console.');
        } else {
          showToast(`✓ Updated ${p ? p.name : 'item'} to KSh ${newPrice.toLocaleString()}`);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Also sync localStorage cache
    localStorage.setItem('twizie_products', JSON.stringify(allProducts));
    updateStats();
    renderProducts();
  };

  // ── 6. DELETE PRODUCT ─────────────────────────────────────────────
  window.deleteProduct = async (id) => {
    const p = allProducts.find(item => item.id === id);
    const name = p ? p.name : 'this product';
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    allProducts = allProducts.filter(item => item.id !== id);

    if (supabaseClient) {
      try {
        await supabaseClient.from('products').delete().eq('id', id);
      } catch (err) {
        console.error(err);
      }
    }

    localStorage.setItem('twizie_products', JSON.stringify(allProducts));
    showToast(`🗑️ Deleted ${name}`);
    updateStats();
    renderProducts();
  };

  // ── 7. ADD / EDIT PRODUCT MODAL ───────────────────────────────────
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const btnOpenAdd = document.getElementById('btn-open-add-modal');
  const form = document.getElementById('product-form');

  const prodIdInput = document.getElementById('prod-id');
  const prodNameInput = document.getElementById('prod-name');
  const prodCatInput = document.getElementById('prod-category');
  const prodTypeInput = document.getElementById('prod-type');
  const prodPriceInput = document.getElementById('prod-price');
  const prodStockInput = document.getElementById('prod-stock');
  const prodStatusInput = document.getElementById('prod-status');
  const prodImgUrlInput = document.getElementById('prod-image-url');
  const prodDescInput = document.getElementById('prod-desc');
  const imgPreview = document.getElementById('image-preview');

  const fileDropArea = document.getElementById('file-drop-area');
  const fileInput = document.getElementById('prod-file-input');

  function openModal(title = 'Add New Product') {
    if (modalTitle) modalTitle.textContent = title;
    if (modal) modal.style.display = 'flex';
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    if (imgPreview) {
      imgPreview.src = '';
      imgPreview.style.display = 'none';
    }
  }

  if (btnOpenAdd) {
    btnOpenAdd.addEventListener('click', () => {
      if (form) form.reset();
      if (prodIdInput) prodIdInput.value = '';
      if (imgPreview) imgPreview.style.display = 'none';
      openModal('Add New Product');
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);

  window.editProductModal = (id) => {
    const p = allProducts.find(item => item.id === id);
    if (!p) return;

    if (prodIdInput) prodIdInput.value = p.id;
    if (prodNameInput) prodNameInput.value = p.name;
    if (prodCatInput) prodCatInput.value = p.category;
    if (prodTypeInput) prodTypeInput.value = p.type;
    if (prodPriceInput) prodPriceInput.value = p.price;
    if (prodStockInput) prodStockInput.value = p.stock || 1;
    if (prodStatusInput) prodStatusInput.value = p.status || 'available';
    if (prodImgUrlInput) prodImgUrlInput.value = p.image || '';
    if (prodDescInput) prodDescInput.value = p.description || '';

    if (p.image && imgPreview) {
      imgPreview.src = p.image;
      imgPreview.style.display = 'block';
    }

    openModal(`Edit: ${p.name}`);
  };

  // Image Upload handler (Uploads to Supabase Storage)
  if (fileDropArea && fileInput) {
    fileDropArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Local preview immediately
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (imgPreview) {
          imgPreview.src = ev.target.result;
          imgPreview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      if (supabaseClient) {
        showToast('Uploading photo to Supabase...');
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `product_${Date.now()}.${fileExt}`;
          const { data, error } = await supabaseClient.storage
            .from('product-images')
            .upload(fileName, file, { cacheControl: '3600', upsert: true });

          if (error) {
            console.error('[Supabase Storage Error]:', error);
            showToast('⚠️ Image upload error. You can still use local path.');
          } else {
            const { data: publicUrlData } = supabaseClient.storage
              .from('product-images')
              .getPublicUrl(fileName);

            if (publicUrlData && publicUrlData.publicUrl) {
              if (prodImgUrlInput) prodImgUrlInput.value = publicUrlData.publicUrl;
              showToast('✓ Photo uploaded successfully!');
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  // Handle Form Submission (Save to Supabase)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = prodIdInput.value.trim() || `prod_${Date.now()}`;
      const productData = {
        id: id,
        name: prodNameInput.value.trim(),
        category: prodCatInput.value,
        type: prodTypeInput.value,
        price: Number(prodPriceInput.value),
        stock: Number(prodStockInput.value) || 1,
        status: prodStatusInput.value,
        image: prodImgUrlInput.value.trim() || 'images/BAG 2.jpg',
        description: prodDescInput.value.trim()
      };

      // Save to Supabase
      if (supabaseClient) {
        showToast('Saving to Supabase...');
        try {
          const { error } = await supabaseClient
            .from('products')
            .upsert([productData]);

          if (error) {
            console.error('[Supabase Error]:', error);
            showToast('⚠️ Database error saving product.');
          } else {
            showToast(`✓ Saved "${productData.name}"!`);
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Update local state
      const existingIdx = allProducts.findIndex(p => p.id === id);
      if (existingIdx >= 0) {
        allProducts[existingIdx] = productData;
      } else {
        allProducts.unshift(productData);
      }

      localStorage.setItem('twizie_products', JSON.stringify(allProducts));
      closeModal();
      updateStats();
      renderProducts();
    });
  }

  // ── 8. SEARCH & FILTERS ───────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-cat') || 'all';
      renderProducts();
    });
  });

  // ── 9. TOAST NOTIFICATIONS ────────────────────────────────────────
  function showToast(msg) {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Check auth on startup
  checkAuth();

});
