/**
 * DULCE ALQUIMIA - APPLICATION ENGINE (Vanilla JS SPA)
 * Controls routing, cart state, dynamic products, currency switcher, auth, and admin interface.
 */

// ==========================================================================
// 1. DATA SEEDING (PRODUCT CATALOG)
// ==========================================================================
let products = [
  {
    id: "prod-1",
    name: "3D 'Evoluzione' Silicone Mold",
    brand: "Silikomart Professional",
    category: "moldes",
    priceSol: 34.90,
    priceUsd: 10.00,
    stock: 25,
    tag: "popular",
    imageType: "svg-mold",
    sku: "SK-EVO-3D",
    description: "Molde de silicona platinum premium con diseño geométrico tridimensional. Soporta temperaturas desde -60°C hasta +230°C."
  },
  {
    id: "prod-2",
    name: "Alkalized Cocoa Powder 1kg",
    brand: "Valrhona Selection",
    category: "insumos",
    priceSol: 42.00,
    priceUsd: 12.00,
    stock: 45,
    tag: "organic",
    imageType: "svg-powder",
    sku: "RA-001",
    description: "Cacao alcalinizado puro de origen francés. Color marrón profundo y sabor robusto ideal para bizcochos y coberturas finas."
  },
  {
    id: "prod-3",
    name: "Vibrant Gel Color Kit (12pcs)",
    brand: "ProGel Master Set",
    category: "decoracion",
    priceSol: 58.50,
    priceUsd: 16.50,
    stock: 15,
    tag: "",
    imageType: "svg-gel",
    sku: "PG-GEL-12",
    description: "Set de colorantes en gel altamente concentrados. No alteran la consistencia de masas, merengues ni cremas."
  },
  {
    id: "prod-4",
    name: "Offset Spatula Precision Set",
    brand: "Alquimia Pro Tools",
    category: "utensilios",
    priceSol: 29.99,
    priceUsd: 8.50,
    stock: 2, // Low stock
    tag: "lowstock",
    imageType: "svg-spatula",
    sku: "SP-OFF-SET",
    description: "Espátulas acodadas de acero inoxidable con mango ergonómico. Perfectas para alisar coberturas y levantar decoraciones."
  },
  {
    id: "prod-5",
    name: "Vanilla Bean Paste 250g",
    brand: "Madagascar Pure",
    category: "insumos",
    priceSol: 49.50,
    priceUsd: 14.00,
    stock: 18,
    tag: "",
    imageType: "svg-vanilla",
    sku: "VN-PST-250",
    description: "Pasta de vainilla bourbon de Madagascar con semillas naturales. Aporta aroma intenso y una estética elegante con puntitos negros."
  },
  {
    id: "prod-6",
    name: "Minimalist Geometric Cake Stand",
    brand: "Studio Display",
    category: "equipos",
    priceSol: 75.00,
    priceUsd: 21.00,
    stock: 8,
    tag: "new",
    imageType: "svg-stand",
    sku: "CS-GEO-MIN",
    description: "Base giratoria metálica para decoración y exhibición de pasteles. Movimiento suave y balineras de precisión."
  },
  {
    id: "prod-7",
    name: "24K Edible Gold Leaf Sheets (25pk)",
    brand: "Lux Deco",
    category: "decoracion",
    priceSol: 89.00,
    priceUsd: 24.50,
    stock: 12,
    tag: "bestseller",
    imageType: "svg-gold",
    sku: "GL-442",
    description: "Láminas de pan de oro de 24 quilates aptas para consumo alimentario. Añaden brillo tridimensional lujoso a tus postres."
  },
  {
    id: "prod-8",
    name: "Elite Stainless Piping Tip Set (24pcs)",
    brand: "Piping Master",
    category: "utensilios",
    priceSol: 32.50,
    priceUsd: 9.00,
    stock: 22,
    tag: "",
    imageType: "svg-piping",
    sku: "PP-TIP-24",
    description: "Boquillas reposteras de acero inoxidable sin costura. Incluye estuche y cepillo de limpieza."
  }
];

// Seed initial orders in dashboard
let orders = [
  { id: "#ORD-4921", client: "Lucía Fernández", items: 2, amountSol: 142.00, amountUsd: 38.50, status: "delivered", time: "Hace 2 mins" },
  { id: "#ORD-4922", client: "Bakery Boutique SL", items: 15, amountSol: 1250.00, amountUsd: 340.00, status: "processing", time: "Hace 15 mins" },
  { id: "#ORD-4923", client: "Marcus V. Alchem", items: 1, amountSol: 45.90, amountUsd: 12.50, status: "pending", time: "Hace 1 hora" }
];

// Seed initial coupons
const validCoupons = {
  "ALQUIMIA10": 0.10, // 10% discount
  "DUCE15": 0.15,     // 15% discount
  "MAGIC20": 0.20     // 20% discount
};

// ==========================================================================
// 2. STATE MANAGER
// ==========================================================================
const state = {
  currentView: 'home',
  currentAdminPanel: 'dashboard',
  currency: 'SOL', // SOL or USD
  cart: [], // items: { productId, quantity }
  currentUser: null,
  activeFilter: 'all',
  activeSearch: '',
  appliedCoupon: null,
  editingProductId: null
};

// SVG visual helper to render professional pastry vector illustrations
function getProductSVG(type) {
  const svgs = {
    "svg-mold": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <defs>
          <linearGradient id="g-mold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fda4af" />
            <stop offset="100%" stop-color="#f43f5e" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="16" fill="#fff5f6" />
        <path d="M100,45 L150,75 L150,125 L100,155 L50,125 L50,75 Z" fill="url(#g-mold)" opacity="0.8" />
        <polygon points="100,45 150,75 100,105 50,75" fill="#fda4af" opacity="0.6" />
        <line x1="100" y1="105" x2="100" y2="155" stroke="#ffffff" stroke-width="2" />
        <line x1="50" y1="125" x2="100" y2="105" stroke="#ffffff" stroke-width="1.5" />
        <line x1="150" y1="125" x2="100" y2="105" stroke="#ffffff" stroke-width="1.5" />
        <!-- Top detail -->
        <circle cx="100" cy="75" r="8" fill="#fff" opacity="0.7" />
      </svg>
    `,
    "svg-powder": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <defs>
          <linearGradient id="g-powder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b45309" />
            <stop offset="100%" stop-color="#78350f" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="16" fill="#fefaf0" />
        <!-- Cocoa bag shape -->
        <path d="M60,60 C60,45 75,35 100,35 C125,35 140,45 140,60 L130,165 C130,170 120,172 100,172 C80,172 70,170 70,165 Z" fill="url(#g-powder)" />
        <!-- Label on bag -->
        <rect x="75" y="80" width="50" height="50" rx="4" fill="#fef3c7" opacity="0.9" />
        <!-- Wheat/Cocoa leaf icon inside label -->
        <path d="M100,90 C108,98 108,110 100,118 C92,110 92,98 100,90 Z" fill="#b45309" opacity="0.8" />
        <line x1="100" y1="90" x2="100" y2="120" stroke="#78350f" stroke-width="2" />
        <!-- Ribbon detail -->
        <path d="M60,60 Q100,68 140,60" fill="none" stroke="#fef3c7" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
    "svg-gel": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <rect width="200" height="200" rx="16" fill="#f0fdfa" />
        <!-- Render 3 color bottles -->
        <!-- Bottle 1 (Red) -->
        <rect x="50" y="65" width="26" height="70" rx="4" fill="#ef4444" />
        <rect x="56" y="50" width="14" height="15" fill="#374151" />
        <rect x="54" y="80" width="18" height="35" fill="#ffffff" opacity="0.9" />
        <!-- Bottle 2 (Teal) -->
        <rect x="87" y="55" width="26" height="80" rx="4" fill="#0f8a84" />
        <rect x="93" y="40" width="14" height="15" fill="#374151" />
        <rect x="91" y="70" width="18" height="45" fill="#ffffff" opacity="0.9" />
        <!-- Bottle 3 (Yellow) -->
        <rect x="124" y="65" width="26" height="70" rx="4" fill="#eab308" />
        <rect x="130" y="50" width="14" height="15" fill="#374151" />
        <rect x="128" y="80" width="18" height="35" fill="#ffffff" opacity="0.9" />
      </svg>
    `,
    "svg-spatula": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <rect width="200" height="200" rx="16" fill="#f8fafc" />
        <!-- Metal offset spatula -->
        <path d="M50,140 L135,55 C138,52 142,52 145,55 L150,60 C153,63 153,67 150,70 L65,155 Z" fill="#94a3b8" />
        <!-- Metal blade overlay -->
        <path d="M90,100 L140,50 L145,55 L95,105 Z" fill="#cbd5e1" />
        <!-- Wooden Handle -->
        <path d="M40,150 L65,125 L75,135 L50,160 Z" fill="#a16207" />
        <circle cx="48" cy="148" r="2" fill="#eab308" />
        <!-- Whisk details in background -->
        <path d="M120,110 Q145,135 155,145 M130,100 Q155,125 165,135" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
      </svg>
    `,
    "svg-vanilla": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <rect width="200" height="200" rx="16" fill="#fcfaf7" />
        <!-- Glass Jar -->
        <rect x="65" y="70" width="70" height="85" rx="8" fill="#dbeafe" stroke="#93c5fd" stroke-width="2" opacity="0.6" />
        <rect x="75" y="55" width="50" height="15" rx="2" fill="#1e293b" />
        <!-- Dark Vanilla Liquid inside -->
        <rect x="70" y="85" width="60" height="65" rx="4" fill="#451a03" />
        <!-- Orchid details/label -->
        <rect x="80" y="95" width="40" height="40" rx="2" fill="#fef3c7" opacity="0.9" />
        <circle cx="100" cy="115" r="6" fill="#f59e0b" />
        <!-- Vanilla Pod in background -->
        <path d="M140,40 Q155,110 120,165" stroke="#271c19" stroke-width="5" stroke-linecap="round" fill="none" />
      </svg>
    `,
    "svg-stand": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <rect width="200" height="200" rx="16" fill="#fdfbf7" />
        <!-- Plate top -->
        <ellipse cx="100" cy="85" rx="65" ry="16" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" />
        <ellipse cx="100" cy="81" rx="64" ry="14" fill="#ffffff" />
        <!-- Pedestal base -->
        <path d="M85,85 L95,145 L70,155 L130,155 L105,145 L115,85 Z" fill="#94a3b8" />
        <!-- Sparkle -->
        <path d="M145,55 L148,63 L156,65 L148,67 L145,75 L142,67 L134,65 L142,63 Z" fill="#f59e0b" opacity="0.8" />
      </svg>
    `,
    "svg-gold": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <defs>
          <linearGradient id="g-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="16" fill="#fffdf5" />
        <!-- Glass Jar/Bowl -->
        <path d="M60,65 L140,65 L130,150 C128,158 120,164 110,164 L90,164 C80,164 72,158 70,150 Z" fill="#fef3c7" stroke="#fbbf24" stroke-width="2" opacity="0.4" />
        <!-- Sparkles of gold -->
        <path d="M80,85 L95,80 L115,95 L125,75 L110,135 L90,125 Z" fill="url(#g-gold)" />
        <circle cx="75" cy="110" r="8" fill="#fbbf24" />
        <circle cx="125" cy="115" r="5" fill="#f59e0b" />
        <circle cx="105" cy="110" r="10" fill="#d97706" />
        <!-- Floating sparkle icons -->
        <path d="M150,50 L153,58 L161,60 L153,62 L150,70 L147,62 L139,60 L147,58 Z" fill="#fbbf24" />
        <path d="M50,130 L52,135 L57,137 L52,139 L50,144 L48,139 L43,137 L48,135 Z" fill="#fbbf24" />
      </svg>
    `,
    "svg-piping": `
      <svg viewBox="0 0 200 200" class="product-svg-display">
        <rect width="200" height="200" rx="16" fill="#fafaf9" />
        <!-- Grid of nozzles -->
        <!-- Nozzle 1 -->
        <path d="M55,95 L65,55 L85,55 L95,95 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" />
        <path d="M65,55 L75,45 L85,55 Z" fill="#94a3b8" />
        <line x1="68" y1="95" x2="72" y2="55" stroke="#ffffff" stroke-width="1.5" />
        <!-- Nozzle 2 -->
        <path d="M105,95 L115,55 L135,55 L145,95 Z" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
        <path d="M115,55 L120,40 L130,40 L135,55 Z" fill="#475569" />
        <line x1="120" y1="95" x2="124" y2="55" stroke="#ffffff" stroke-width="1.5" />
        <!-- Star tip details -->
        <path d="M55,145 Q100,110 145,145" fill="none" stroke="#f43f5e" stroke-width="8" stroke-linecap="round" opacity="0.15" />
      </svg>
    `
  };
  return svgs[type] || svgs["svg-mold"];
}

// ==========================================================================
// 3. CORE ROUTING SYSTEM & NAVIGATION
// ==========================================================================
function switchView(targetViewId) {
  // Update state
  state.currentView = targetViewId;
  
  // Close mobile drawer if open
  closeMobileDrawer();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active status in navigation menus (desktop & mobile drawer)
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-view') === targetViewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Switch visible section
  const views = document.querySelectorAll('.app-view');
  views.forEach(view => {
    const viewId = view.getAttribute('id').replace('view-', '');
    if (viewId === targetViewId) {
      view.classList.add('active-view');
    } else {
      view.classList.remove('active-view');
    }
  });

  // Trigger sub-view logic
  if (targetViewId === 'catalog') {
    renderCatalog();
  } else if (targetViewId === 'cart') {
    renderCart();
  } else if (targetViewId === 'admin') {
    renderAdminPanel();
  }
}

// Mobile drawer controls
function openMobileDrawer() {
  document.getElementById('mobile-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('visible');
}

function closeMobileDrawer() {
  document.getElementById('mobile-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('visible');
}

// ==========================================================================
// 4. CURRENCY STATE & CONVERSION
// ==========================================================================
function setCurrency(newCurrency) {
  state.currency = newCurrency;
  
  // Update header indicators
  document.getElementById('active-currency').innerText = newCurrency;
  document.getElementById('mobile-active-currency').innerText = newCurrency;
  
  // Rerender active views
  if (state.currentView === 'catalog') {
    renderCatalog();
  } else if (state.currentView === 'cart') {
    renderCart();
  } else if (state.currentView === 'admin') {
    renderAdminPanel();
  }
}

function formatPrice(solVal, usdVal) {
  if (state.currency === 'SOL') {
    return `S/ ${solVal.toFixed(2)}`;
  } else {
    return `$ ${usdVal.toFixed(2)}`;
  }
}

// ==========================================================================
// 5. CATALOG MODULE (RENDER, SEARCH, FILTER)
// ==========================================================================
function renderCatalog() {
  const grid = document.getElementById('catalog-product-grid');
  grid.innerHTML = '';

  // Filter & Search logic
  let filtered = products.filter(p => {
    // Category check
    const matchesCategory = (state.activeFilter === 'all' || 
                             p.category === state.activeFilter ||
                             (state.activeFilter === 'ofertas' && p.tag === 'lowstock')); // Lowstock simulated as special offer

    // Search check
    const matchesSearch = p.name.toLowerCase().includes(state.activeSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(state.activeSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(state.activeSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results-msg" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3>No se encontraron ingredientes mágicos</h3>
        <p style="color: var(--color-medium)">Intenta buscando otro término o cambiando los filtros de categoría.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    // Check quantity state or default to 1
    const qtyId = `qty-select-${p.id}`;
    
    // Determine badge tag label
    let badgeHTML = '';
    if (p.tag) {
      const tagLabels = {
        'popular': 'Popular',
        'organic': 'Orgánico',
        'lowstock': 'Bajo Stock',
        'new': 'Nuevo',
        'bestseller': 'Best Seller'
      };
      badgeHTML = `<span class="product-badge-tag badge-${p.tag}">${tagLabels[p.tag] || p.tag}</span>`;
    }

    // Determine stock status indicator
    let stockHTML = '';
    if (p.stock <= 3) {
      stockHTML = `
        <span class="product-stock-status status-lowstock">
          <span class="status-dot"></span>
          ${p.stock} Unidades
        </span>
      `;
    } else {
      stockHTML = `
        <span class="product-stock-status status-instock">
          <span class="status-dot"></span>
          Disponible
        </span>
      `;
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${badgeHTML}
      <div class="product-img-wrapper">
        ${getProductSVG(p.imageType)}
      </div>
      <div class="product-body">
        <span class="product-brand">${p.brand}</span>
        <h3 class="product-name" title="${p.name}">${p.name}</h3>
        
        <div class="product-meta-row">
          <div class="product-price-box">
            <span class="product-price">${formatPrice(p.priceSol, p.priceUsd)}</span>
          </div>
          ${stockHTML}
        </div>

        <div class="product-actions-bar">
          <div class="quantity-stepper">
            <button class="qty-btn" onclick="adjustCatalogQty('${p.id}', -1)" aria-label="Restar">-</button>
            <span class="qty-val" id="${qtyId}">1</span>
            <button class="qty-btn" onclick="adjustCatalogQty('${p.id}', 1)" aria-label="Sumar">+</button>
          </div>
          <button class="btn-add-cart" onclick="addProductToCart('${p.id}')">
            <svg class="btn-add-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Agregar</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function adjustCatalogQty(prodId, diff) {
  const el = document.getElementById(`qty-select-${prodId}`);
  if (el) {
    let val = parseInt(el.innerText);
    val += diff;
    if (val < 1) val = 1;
    el.innerText = val;
  }
}

// Filter pills interaction
function setupFilterPills() {
  const pills = document.querySelectorAll('#filter-pills-container .pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeFilter = pill.getAttribute('data-filter');
      renderCatalog();
    });
  });

  // Search input interaction
  const searchInput = document.getElementById('catalog-search');
  searchInput.addEventListener('input', (e) => {
    state.activeSearch = e.target.value;
    renderCatalog();
  });
}

// ==========================================================================
// 6. CART STATE MANAGEMENT
// ==========================================================================
function updateCartCountBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = count;
}

function addProductToCart(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  // Get selected qty from catalog card
  const qtyEl = document.getElementById(`qty-select-${productId}`);
  const qtyToAdd = qtyEl ? parseInt(qtyEl.innerText) : 1;

  // Check if item already in cart
  const cartItem = state.cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity += qtyToAdd;
  } else {
    state.cart.push({ productId, quantity: qtyToAdd });
  }

  // Update badge and visual effects
  updateCartCountBadge();
  
  // Animate floating cart button or provide brief trigger
  const badge = document.getElementById('cart-count');
  badge.style.transform = 'scale(1.4)';
  setTimeout(() => {
    badge.style.transform = 'scale(1)';
  }, 300);

  // Reset card quantity selector back to 1
  if (qtyEl) qtyEl.innerText = 1;
}

function removeProductFromCart(productId) {
  state.cart = state.cart.filter(item => item.productId !== productId);
  updateCartCountBadge();
  renderCart();
}

function changeCartItemQty(productId, diff) {
  const item = state.cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += diff;
    if (item.quantity < 1) {
      removeProductFromCart(productId);
      return;
    }
    updateCartCountBadge();
    renderCart();
  }
}

function renderCart() {
  const listEl = document.getElementById('cart-items-list');
  const summarySidebar = document.getElementById('cart-summary-sidebar');
  
  // Clear previous items
  const emptyStateEl = document.getElementById('empty-cart-msg');
  
  // Clean custom items (keeping the empty state message)
  const existingCards = listEl.querySelectorAll('.cart-item-card');
  existingCards.forEach(card => card.remove());

  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-status-text').innerText = `Tienes ${count} artículo${count === 1 ? '' : 's'} en tu selección de hoy.`;

  if (state.cart.length === 0) {
    emptyStateEl.style.display = 'flex';
    summarySidebar.style.opacity = '0.5';
    summarySidebar.style.pointerEvents = 'none';
    
    // Reset summaries
    document.getElementById('summary-subtotal').innerText = formatPrice(0, 0);
    document.getElementById('summary-tax').innerText = formatPrice(0, 0);
    document.getElementById('summary-total').innerText = formatPrice(0, 0);
    return;
  }

  emptyStateEl.style.display = 'none';
  summarySidebar.style.opacity = '1';
  summarySidebar.style.pointerEvents = 'auto';

  // Calculate pricing
  let subtotalSol = 0;
  let subtotalUsd = 0;

  state.cart.forEach(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (!p) return;

    subtotalSol += p.priceSol * item.quantity;
    subtotalUsd += p.priceUsd * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item-card';
    row.innerHTML = `
      <div class="cart-item-img-box">
        ${getProductSVG(p.imageType)}
      </div>
      <div class="cart-item-details">
        ${p.tag ? `<span class="item-badge">${p.tag.toUpperCase()}</span>` : ''}
        <h4>${p.name}</h4>
        <span>Código: ${p.sku} | Unit: ${formatPrice(p.priceSol, p.priceUsd)}</span>
      </div>
      <div class="cart-item-qty-cell">
        <div class="quantity-stepper">
          <button class="qty-btn" onclick="changeCartItemQty('${p.id}', -1)" aria-label="Restar">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="changeCartItemQty('${p.id}', 1)" aria-label="Sumar">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">${formatPrice(p.priceSol * item.quantity, p.priceUsd * item.quantity)}</span>
        <button class="btn-remove-item" onclick="removeProductFromCart('${p.id}')">
          <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Eliminar</span>
        </button>
      </div>
    `;
    listEl.insertBefore(row, emptyStateEl); // Insert before empty state placeholder
  });

  // Calculate totals
  let discountFactor = state.appliedCoupon ? validCoupons[state.appliedCoupon] : 0;
  let discSol = subtotalSol * discountFactor;
  let discUsd = subtotalUsd * discountFactor;

  let netSol = subtotalSol - discSol;
  let netUsd = subtotalUsd - discUsd;

  let taxSol = netSol * 0.18; // 18% IGV standard
  let taxUsd = netUsd * 0.18;

  let totalSol = netSol + taxSol;
  let totalUsd = netUsd + taxUsd;

  // Render summaries
  document.getElementById('summary-subtotal').innerText = formatPrice(subtotalSol, subtotalUsd);
  document.getElementById('summary-tax').innerText = formatPrice(taxSol, taxUsd);
  
  if (state.appliedCoupon) {
    document.getElementById('summary-tax').innerHTML += ` <span style="color:var(--color-green); font-size:0.75rem">(Desc. ${(discountFactor*100)}% aplicado)</span>`;
  }

  document.getElementById('summary-total').innerText = formatPrice(totalSol, totalUsd);
}

function setupCouponLogic() {
  const btn = document.getElementById('btn-apply-coupon');
  const input = document.getElementById('coupon-code');
  const msg = document.getElementById('coupon-msg');

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.className = 'coupon-message color-red';
      msg.innerText = 'Por favor ingresa un código.';
      return;
    }

    if (validCoupons[code] !== undefined) {
      state.appliedCoupon = code;
      msg.className = 'coupon-message color-green';
      msg.innerText = `¡Cupón ${code} aplicado! Descuento del ${(validCoupons[code]*100)}%.`;
      renderCart();
    } else {
      state.appliedCoupon = null;
      msg.className = 'coupon-message color-red';
      msg.innerText = 'Código de cupón inválido.';
      renderCart();
    }
  });
}

function processCheckout() {
  if (state.cart.length === 0) return;

  // Calculate final amount for success display
  let subtotalSol = 0;
  let subtotalUsd = 0;

  state.cart.forEach(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      subtotalSol += p.priceSol * item.quantity;
      subtotalUsd += p.priceUsd * item.quantity;
    }
  });

  let discountFactor = state.appliedCoupon ? validCoupons[state.appliedCoupon] : 0;
  let netSol = subtotalSol * (1 - discountFactor);
  let netUsd = subtotalUsd * (1 - discountFactor);
  
  let finalSol = netSol * 1.18;
  let finalUsd = netUsd * 1.18;

  // Trigger success modal
  const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById('success-order-id').innerText = orderId;
  document.getElementById('success-order-amount').innerText = formatPrice(finalSol, finalUsd);

  // Sync with Admin Dashboard live feed
  const totalQty = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  orders.unshift({
    id: orderId,
    client: state.currentUser ? state.currentUser.name : "Alquimista Anónimo",
    items: totalQty,
    amountSol: finalSol,
    amountUsd: finalUsd,
    status: "processing",
    time: "Hoy"
  });

  // Clear state cart
  state.cart = [];
  state.appliedCoupon = null;
  document.getElementById('coupon-code').value = '';
  document.getElementById('coupon-msg').innerText = '';
  updateCartCountBadge();

  // Show checkout Success overlay modal
  const successModal = document.getElementById('modal-checkout-success');
  successModal.classList.add('open');
}

// ==========================================================================
// 7. AUTHENTICATION MODULE (LOGIN & CREATE ACCOUNT)
// ==========================================================================
function setupAuthEvents() {
  const modal = document.getElementById('modal-auth');
  const trigger = document.getElementById('btn-auth-trigger');
  const closeBtn = document.getElementById('btn-close-auth');
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegister = document.getElementById('tab-register-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // Trigger overlay display
  trigger.addEventListener('click', () => {
    if (state.currentUser) {
      // Mock logout if already logged in
      if (confirm('¿Deseas cerrar sesión en Dulce Alquimia?')) {
        state.currentUser = null;
        document.getElementById('user-display').innerText = 'Ingresar';
        alert('Sesión cerrada.');
      }
    } else {
      modal.classList.add('open');
    }
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  
  // Clicking outside modal content shuts it
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Tab switching between forms
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.add('active-form');
    formRegister.classList.remove('active-form');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.add('active-form');
    formLogin.classList.remove('active-form');
  });

  // Mock Form Submit logic
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    state.currentUser = {
      email: email,
      name: email.split('@')[0]
    };
    
    // Success feedback
    document.getElementById('user-display').innerText = `Hola, ${state.currentUser.name}`;
    modal.classList.remove('open');
    // Clear inputs
    formLogin.reset();
  });

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    state.currentUser = {
      email: document.getElementById('register-email').value,
      name: name
    };

    document.getElementById('user-display').innerText = `Hola, ${name}`;
    modal.classList.remove('open');
    formRegister.reset();
  });
}

// ==========================================================================
// 8. ADMIN DASHBOARD CONTROL
// ==========================================================================
function setupAdminEvents() {
  const sidebarLinks = document.querySelectorAll('.admin-sidebar .sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetSubPanel = link.getAttribute('data-admin-panel');
      switchAdminSubPanel(targetSubPanel);
    });
  });

  // Add Product button inside admin sidebar
  document.getElementById('btn-admin-add-product').addEventListener('click', () => {
    openAddProductForm();
  });
  
  document.getElementById('btn-admin-new-product-top').addEventListener('click', () => {
    openAddProductForm();
  });

  // Form cancel button
  document.getElementById('btn-form-cancel').addEventListener('click', () => {
    switchAdminSubPanel('inventory');
  });

  // Form submit callback
  document.getElementById('form-product').addEventListener('submit', saveProductFromForm);
  
  // Dashboard view-all-inventory links
  document.querySelector('.btn-view-all-inventory').addEventListener('click', () => {
    const invLink = document.querySelector('[data-admin-panel="inventory"]');
    if (invLink) invLink.click();
  });

  // Admin Search filter
  document.getElementById('admin-search-input').addEventListener('input', (e) => {
    const searchVal = e.target.value.toLowerCase();
    renderAdminInventoryTable(searchVal);
  });
}

function switchAdminSubPanel(panelId) {
  state.currentAdminPanel = panelId;

  // Update section title text
  const sectionTitle = document.getElementById('admin-section-title');
  const titles = {
    'dashboard': 'Overview',
    'inventory': 'Inventory Management',
    'orders': 'Recent Orders Feed',
    'clients': 'Registered Clients',
    'settings': 'Alchemist Shop Settings',
    'edit-product': state.editingProductId ? 'Modificar Producto' : 'Agregar Nuevo Producto'
  };
  sectionTitle.innerText = titles[panelId] || 'Overview';

  // Toggle visible containers
  const subViews = document.querySelectorAll('.admin-sub-view');
  subViews.forEach(view => {
    if (view.getAttribute('id') === `admin-panel-${panelId}`) {
      view.classList.add('active-sub-view');
    } else {
      view.classList.remove('active-sub-view');
    }
  });

  // Rerender depending on page
  if (panelId === 'dashboard' || panelId === 'inventory') {
    renderAdminInventoryTable();
  }
}

function renderAdminInventoryTable(searchFilter = '') {
  // Update low stock metric count
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  document.getElementById('admin-low-stock-count').innerText = `${lowStockCount} Artículo${lowStockCount === 1 ? '' : 's'}`;

  // Filter products list
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchFilter) || p.sku.toLowerCase().includes(searchFilter));

  // 1. Dashboard Overview Mini-table
  const overviewTbody = document.getElementById('admin-inventory-table-tbody');
  if (overviewTbody) {
    overviewTbody.innerHTML = '';
    
    // Just take 3 items for overview dashboard
    filtered.slice(0, 3).forEach(p => {
      const row = document.createElement('tr');
      
      const categoryLabels = {
        'insumos': 'Bases',
        'decoracion': 'Decor',
        'moldes': 'Bases',
        'utensilios': 'Bases',
        'equipos': 'Bases',
        'empaques': 'Bases'
      };
      
      const tagMap = {
        'insumos': 'tag-bases',
        'decoracion': 'tag-decor',
        'moldes': 'tag-bases',
        'utensilios': 'tag-bases'
      };
      const catClass = tagMap[p.category] || 'tag-bases';
      const catLabel = categoryLabels[p.category] || 'Bases';

      row.innerHTML = `
        <td>
          <div class="admin-table-product-cell">
            <div class="admin-table-prod-img">${getProductSVG(p.imageType)}</div>
            <div>
              <strong>${p.name}</strong>
              <span>SKU: ${p.sku}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="admin-stock-badge ${p.stock <= 5 ? 'admin-stock-low' : ''}">${p.stock}</span>
        </td>
        <td><strong>S/ ${p.priceSol.toFixed(2)}</strong></td>
        <td>
          <span class="admin-category-tag ${catClass}">${catLabel}</span>
        </td>
        <td>
          <div class="admin-actions-cell">
            <button class="btn-admin-action" onclick="openEditProductForm('${p.id}')" title="Editar">
              <!-- Edit Icon -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>
        </td>
      `;
      overviewTbody.appendChild(row);
    });
  }

  // 2. Full inventory panel view table
  const fullTbody = document.getElementById('admin-full-inventory-tbody');
  if (fullTbody) {
    fullTbody.innerHTML = '';
    filtered.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="admin-table-product-cell">
            <div class="admin-table-prod-img">${getProductSVG(p.imageType)}</div>
            <div>
              <strong>${p.name}</strong>
              <span>Marca: ${p.brand}</span>
            </div>
          </div>
        </td>
        <td><strong>${p.sku}</strong></td>
        <td><span style="text-transform:uppercase; font-size:0.75rem; font-weight:600">${p.category}</span></td>
        <td><span class="admin-stock-badge ${p.stock <= 5 ? 'admin-stock-low' : ''}">${p.stock}</span></td>
        <td>S/ ${p.priceSol.toFixed(2)}</td>
        <td>$ ${p.priceUsd.toFixed(2)}</td>
        <td><span style="font-size:0.75rem; color:var(--brand-primary); font-weight:700">${p.tag ? p.tag.toUpperCase() : '-'}</span></td>
        <td>
          <div class="admin-actions-cell">
            <button class="btn-admin-action" onclick="openEditProductForm('${p.id}')" title="Editar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn-admin-action" onclick="deleteProductFromInventory('${p.id}')" title="Eliminar" style="color:var(--color-crimson)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      fullTbody.appendChild(row);
    });
  }

  // 3. Render orders feed in dashboard
  const ordersListEl = document.getElementById('admin-orders-list');
  if (ordersListEl) {
    ordersListEl.innerHTML = '';
    orders.slice(0, 3).forEach(ord => {
      const statusLabels = { 'delivered': 'Entregado', 'processing': 'Procesando', 'pending': 'Pendiente' };
      const statusText = statusLabels[ord.status] || ord.status;
      
      const itemRow = document.createElement('div');
      itemRow.className = 'order-item-row';
      itemRow.innerHTML = `
        <div class="order-meta-info">
          <strong>${ord.id} - ${ord.client}</strong>
          <span>${ord.items} artículos | ${formatPrice(ord.amountSol, ord.amountUsd)}</span>
        </div>
        <div class="order-status-group">
          <span class="order-status-badge status-${ord.status}">${statusText}</span>
          <span style="font-size:0.65rem; color:var(--color-medium)">${ord.time}</span>
        </div>
      `;
      ordersListEl.appendChild(itemRow);
    });
  }
}

function openAddProductForm() {
  state.editingProductId = null;
  
  // Clear forms
  document.getElementById('form-product').reset();
  document.getElementById('form-prod-id').value = '';
  document.getElementById('form-product-title').innerText = 'Agregar Nuevo Producto';
  
  switchAdminSubPanel('edit-product');
}

function openEditProductForm(prodId) {
  const p = products.find(prod => prod.id === prodId);
  if (!p) return;

  state.editingProductId = prodId;

  // Load product fields
  document.getElementById('form-prod-id').value = p.id;
  document.getElementById('form-prod-name').value = p.name;
  document.getElementById('form-prod-brand').value = p.brand;
  document.getElementById('form-prod-sku').value = p.sku;
  document.getElementById('form-prod-category').value = p.category;
  document.getElementById('form-prod-price-sol').value = p.priceSol;
  document.getElementById('form-prod-price-usd').value = p.priceUsd;
  document.getElementById('form-prod-stock').value = p.stock;
  document.getElementById('form-prod-tag').value = p.tag;
  document.getElementById('form-prod-image').value = p.imageType;
  document.getElementById('form-prod-description').value = p.description || '';

  document.getElementById('form-product-title').innerText = 'Modificar Producto';
  switchAdminSubPanel('edit-product');
}

function deleteProductFromInventory(prodId) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto de la Alquimia?')) {
    products = products.filter(p => p.id !== prodId);
    
    // Refresh
    renderAdminInventoryTable();
    renderCatalog();
    alert('Producto eliminado con éxito.');
  }
}

function saveProductFromForm(e) {
  e.preventDefault();

  const id = document.getElementById('form-prod-id').value || `prod-${Math.floor(1000 + Math.random() * 9000)}`;
  const name = document.getElementById('form-prod-name').value;
  const brand = document.getElementById('form-prod-brand').value;
  const sku = document.getElementById('form-prod-sku').value;
  const category = document.getElementById('form-prod-category').value;
  const priceSol = parseFloat(document.getElementById('form-prod-price-sol').value);
  const priceUsd = parseFloat(document.getElementById('form-prod-price-usd').value);
  const stock = parseInt(document.getElementById('form-prod-stock').value);
  const tag = document.getElementById('form-prod-tag').value;
  const imageType = document.getElementById('form-prod-image').value;
  const description = document.getElementById('form-prod-description').value;

  const productData = {
    id, name, brand, category, priceSol, priceUsd, stock, tag, imageType, sku, description
  };

  if (state.editingProductId) {
    // Update existing
    const index = products.findIndex(p => p.id === state.editingProductId);
    if (index !== -1) {
      products[index] = productData;
    }
    alert('Producto modificado con éxito.');
  } else {
    // Add new
    products.push(productData);
    alert('Producto agregado con éxito a la Alquimia.');
  }

  // Sync state back to catalog view
  renderCatalog();
  
  // Go back to inventory overview
  switchAdminSubPanel('inventory');
}

function renderAdminPanel() {
  // Always default to overview dashboard when opening admin section
  switchAdminSubPanel(state.currentAdminPanel);
}

// ==========================================================================
// 9. EVENT BINDING & INITS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation clicks
  const desktopLinks = document.querySelectorAll('#nav-links .nav-link, #nav-logo');
  desktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Logo click leads to home
      if (link.getAttribute('id') === 'nav-logo') {
        switchView('home');
        return;
      }
      
      const target = link.getAttribute('data-view');
      switchView(target);
    });
  });

  // Mobile drawer links navigation
  const drawerLinks = document.querySelectorAll('.drawer-links .drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-view');
      switchView(target);
    });
  });

  // Mobile Drawer toggles
  document.getElementById('btn-mobile-menu').addEventListener('click', openMobileDrawer);
  document.getElementById('btn-close-drawer').addEventListener('click', closeMobileDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeMobileDrawer);

  // Footer Navigation links binding
  const footerLinks = document.querySelectorAll('.footer-nav-link');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-view');
      if (target) switchView(target);
    });
  });

  // 2. Currency Selector triggers
  document.getElementById('currency-toggle').addEventListener('click', () => {
    const nextCurr = state.currency === 'SOL' ? 'USD' : 'SOL';
    setCurrency(nextCurr);
  });
  document.getElementById('mobile-currency-toggle').addEventListener('click', () => {
    const nextCurr = state.currency === 'SOL' ? 'USD' : 'SOL';
    setCurrency(nextCurr);
  });

  // 3. Landing page CTA buttons
  document.getElementById('btn-home-shop').addEventListener('click', () => switchView('catalog'));
  document.getElementById('btn-explore-categories').addEventListener('click', () => switchView('catalog'));
  
  // Category cards link directly to filtered catalog
  const catCards = document.querySelectorAll('.category-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const filterValue = card.getAttribute('data-category');
      state.activeFilter = filterValue;
      
      // Update catalog filter pill view highlights
      const pills = document.querySelectorAll('#filter-pills-container .pill-btn');
      pills.forEach(p => {
        if (p.getAttribute('data-filter') === filterValue) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      switchView('catalog');
    });
  });

  // 4. Cart trigger header
  document.getElementById('btn-cart-trigger').addEventListener('click', () => switchView('cart'));
  document.getElementById('btn-cart-empty-shop').addEventListener('click', () => switchView('catalog'));
  document.getElementById('btn-continue-shopping').addEventListener('click', () => switchView('catalog'));
  
  // 5. Checkout confirming
  document.getElementById('btn-checkout-confirm').addEventListener('click', processCheckout);
  document.getElementById('btn-success-close').addEventListener('click', () => {
    document.getElementById('modal-checkout-success').classList.remove('open');
    switchView('catalog');
  });

  // 6. Magic Sparkle Button (Image 2 bottom right float button)
  // Clicking this float triggers catalog or dashboard modal
  document.getElementById('btn-floating-magic').addEventListener('click', () => {
    // Adds a random premium item to cart immediately as a "gift / demo"
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    alert(`✨ ¡La Alquimia te regala un ingrediente mágico! Se ha añadido "${randomProduct.name}" a tu carrito.`);
    addProductToCart(randomProduct.id);
  });

  // 7. Newsletters mock submits
  const footerNewsletter = document.getElementById('btn-newsletter-footer');
  if (footerNewsletter) {
    footerNewsletter.addEventListener('click', () => {
      const email = document.getElementById('footer-email-input').value;
      if (email) {
        alert(`🔮 ¡Gracias por suscribirte al Círculo de Alquimistas! Recibirás promociones secretas en ${email}.`);
        document.getElementById('footer-email-input').value = '';
      }
    });
  }

  // 8. Bootstrap sub-modules
  setupFilterPills();
  setupCouponLogic();
  setupAuthEvents();
  setupAdminEvents();
  
  // First render
  updateCartCountBadge();
  renderCatalog();
});

function copyCoupon(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert(`✨ Código "${code}" copiado al portapapeles. ¡Úsalo en tu carrito!`);
  }).catch(err => {
    alert(`Código de cupón: ${code}`);
  });
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  alert(`✉️ ¡Gracias ${name}! Tu consulta ha sido enviada con éxito. Nos comunicaremos contigo al correo ${email} a la brevedad.`);
  document.getElementById('form-contact-inquiry').reset();
}

// Expose functions globally for element event attributes in HTML template
window.adjustCatalogQty = adjustCatalogQty;
window.addProductToCart = addProductToCart;
window.removeProductFromCart = removeProductFromCart;
window.changeCartItemQty = changeCartItemQty;
window.openEditProductForm = openEditProductForm;
window.deleteProductFromInventory = deleteProductFromInventory;
window.switchAdminSubPanel = switchAdminSubPanel;
window.copyCoupon = copyCoupon;
window.handleContactSubmit = handleContactSubmit;
