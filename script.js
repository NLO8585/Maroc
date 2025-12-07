/* ------------------- FUNCTIONS GLOBALES ------------------- */
// Panier sessionStorage
function getCart() {
  return JSON.parse(sessionStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCartItem(item) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;

  // Somme toutes les quantités
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  countEl.textContent = totalItems;
}

function renderCart() {
  const cartContent = document.querySelector('#cart-sidebar .cart-content');
  if (!cartContent) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartContent.innerHTML = '<p>Votre panier est vide pour le moment.</p>';
    return;
  }

  cartContent.innerHTML = '';

  cart.forEach((p) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-product';

    itemEl.innerHTML = `
      <img src="${p.img || 'image/photo_a_venir.png'}" alt="">
      <div class="cart-product-details">
        <h4>${p.title}</h4>
        <p>${p.dimensions}</p>
        <p>${p.price} — Qté : ${p.quantity}</p>
      </div>
      <button class="remove-item" data-id="${p.id}">✖</button>
    `;

    cartContent.appendChild(itemEl);
  });

  const total = cart.reduce((sum, item) => {
    const numericPrice = parseFloat(
      String(item.price)
        .replace(/[^\d.,]/g, '')
        .replace(',', '.')
    );
    return sum + item.quantity * (numericPrice || 0);
  }, 0);

  const totalEl = document.createElement('div');
  totalEl.className = 'cart-total';
  totalEl.innerHTML = `
    <div class="cart-total-line">
        <span>Total :</span>
        <span>${total.toFixed(2)} €</span>
    </div>
    <button class="checkout-btn">COMMANDER</button>
`;
  cartContent.appendChild(totalEl);

  // Event - Suppression produit
  document.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
    });
  });
  //Redirection vers panier.html
  const checkoutBtn = totalEl.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'panier.html'; // chemin relatif
    });
  }
}

// Fonction CSV globale
function loadProductsFromCSV(callback) {
  if (typeof Papa === 'undefined') {
    console.error(
      "PapaParse non trouvé : assure-toi d'inclure la lib avant script.js"
    );
    return callback([]);
  }
  Papa.parse('BDD.csv', {
    header: true,
    download: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      callback(results.data || []);
    },
    error: function (err) {
      console.error('Erreur lecture CSV:', err);
      callback([]);
    },
  });
}

// Filtre les produits selon ID prefix
function filterProducts(products, prefix) {
  return products.filter((p) => {
    const id = p['ID unique'] || '';
    return id.startsWith(prefix);
  });
}
/* ============================================================
   === Tout dans un seul DOMContentLoaded pour éviter les collisions
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  /* ------------------- Menu hamburger ------------------- */
  (function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const menuHome = document.querySelector('.sommaire');
    const menuAnnexes = document.querySelector('.sommaire_annexes');
    const menu = menuHome || menuAnnexes;
    if (!hamburger || !menu) return;

    let isMenuOpen = false;
    const toggleMenu = (e) => {
      e.preventDefault();
      isMenuOpen = !isMenuOpen;
      menu.classList.toggle('active', isMenuOpen);
      hamburger.classList.toggle('active', isMenuOpen);
    };
    hamburger.addEventListener('click', toggleMenu);
  })();

  /* ------------------- Scroll vers section suivante ------------------- */
  window.scrollToNextSection = () => {
    const nextSection = document.querySelector('.section_blanche');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  /* ------------------- Panier (sidebar) ------------------- */
  (function initCartUI() {
    const cartIcon = document.querySelector('.cart-trigger');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');

    if (!cartIcon || !cartSidebar || !closeCart || !cartOverlay) return;

    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.add('active');
      cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
    });
  })();

  /* ------------------- Auth (inscription / login / profil) ------------------- */
  (function initAuth() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const user = { name, email, password };
        localStorage.setItem('user', JSON.stringify(user));
        alert('Compte créé avec succès !');
        window.location.href = 'login.html';
      });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (
          !savedUser ||
          savedUser.email !== email ||
          savedUser.password !== password
        ) {
          alert('Email ou mot de passe incorrect.');
          return;
        }
        localStorage.setItem('logged', 'true');
        window.location.href = 'profil.html';
      });
    }

    if (window.location.pathname.includes('profil.html')) {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const logged = localStorage.getItem('logged');
      if (!logged) {
        window.location.href = 'login.html';
        return;
      }
      const nameEl = document.getElementById('profile-name');
      const emailEl = document.getElementById('profile-email');
      if (nameEl) nameEl.textContent = savedUser.name || '';
      if (emailEl) emailEl.textContent = savedUser.email || '';
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('logged');
          window.location.href = 'login.html';
        });
      }
    }
  })();

  /* ------------------- Menu déroulant (submenus) ------------------- */
  (function initMenus() {
    const menus = document.querySelectorAll(
      '.sommaire li.has-submenu, .sommaire_annexes li.has-submenu'
    );
    menus.forEach((menu) => {
      const submenu = menu.querySelector('.submenu');
      if (!submenu) return;
      const openMenu = () => {
        submenu.style.opacity = '1';
        submenu.style.pointerEvents = 'auto';
        submenu.style.transform = 'translateY(0)';
      };
      const closeMenu = (e) => {
        if (!menu.contains(e.relatedTarget)) {
          submenu.style.opacity = '0';
          submenu.style.pointerEvents = 'none';
          submenu.style.transform = 'translateY(10px)';
        }
      };
      menu.addEventListener('mouseenter', openMenu);
      menu.addEventListener('mouseleave', closeMenu);
      submenu.addEventListener('mouseenter', openMenu);
      submenu.addEventListener('mouseleave', closeMenu);
    });
  })();

  /* ====================================================
     ============= PRODUCTS: CSV, render, events =========
     ==================================================== */

  // DOM references for product zone, sorting and pagination
  const grid = document.getElementById('products-grid');
  const sortSelect = document.getElementById('sort-select');
  const paginationContainer = document.getElementById('pagination');
  const productCountEl = document.getElementById('product-count');

  /* ------------ Pagination & Sorting core (définitions) ------------ */
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;

  function getItems() {
    return grid ? Array.from(grid.children) : [];
  }

  function updateProductCount() {
    if (productCountEl) productCountEl.textContent = getItems().length;
  }

  function renderPagination() {
    if (!paginationContainer) return;
    const items = getItems();
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      items.forEach((it) => (it.style.display = 'flex'));
      currentPage = 1;
      return;
    } else {
      paginationContainer.style.display = 'flex';
    }

    paginationContainer.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn nav';
    prevBtn.textContent = '‹';
    prevBtn.setAttribute('aria-label', 'Page précédente');
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) showPage(currentPage - 1);
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      btn.setAttribute('data-page', i);
      btn.addEventListener('click', () => showPage(i));
      paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn nav';
    nextBtn.textContent = '›';
    nextBtn.setAttribute('aria-label', 'Page suivante');
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) showPage(currentPage + 1);
    });
    paginationContainer.appendChild(nextBtn);

    showPage(1);
  }

  function showPage(page) {
    const items = getItems();
    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    items.forEach((item, idx) => {
      item.style.display = idx >= start && idx < end ? 'flex' : 'none';
    });

    // Update buttons
    const btns = Array.from(paginationContainer.querySelectorAll('.page-btn'));
    if (btns.length === 0) return;
    const prevBtn = btns[0];
    const nextBtn = btns[btns.length - 1];
    const numberBtns = btns.slice(1, btns.length - 1);

    numberBtns.forEach((b, i) => {
      const pageNum = i + 1;
      if (pageNum === page) {
        b.classList.add('active');
        b.setAttribute('aria-current', 'page');
      } else {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      }
    });

    if (page <= 1) {
      prevBtn.classList.add('disabled');
      prevBtn.setAttribute('aria-disabled', 'true');
    } else {
      prevBtn.classList.remove('disabled');
      prevBtn.removeAttribute('aria-disabled');
    }

    if (page >= totalPages) {
      nextBtn.classList.add('disabled');
      nextBtn.setAttribute('aria-disabled', 'true');
    } else {
      nextBtn.classList.remove('disabled');
      nextBtn.removeAttribute('aria-disabled');
    }

    // remonte en haut si besoin
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applySort(value) {
    const items = getItems();
    if (!items || items.length === 0) return;
    if (value === 'price-asc') {
      items.sort(
        (a, b) =>
          parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0)
      );
    } else if (value === 'price-desc') {
      items.sort(
        (a, b) =>
          parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0)
      );
    } else if (value === 'size-asc') {
      items.sort(
        (a, b) =>
          parseFloat(a.dataset.size || 0) - parseFloat(b.dataset.size || 0)
      );
    } else if (value === 'size-desc') {
      items.sort(
        (a, b) =>
          parseFloat(b.dataset.size || 0) - parseFloat(a.dataset.size || 0)
      );
    } else {
      // default: do nothing (keeps DOM order)
    }
    items.forEach((item) => grid.appendChild(item));
    renderPagination();
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      applySort(this.value);
      updateProductCount();
    });
  }

  /* ------------ CSV loading + rendering products ------------ */

  function generateProductCard(product) {
    const title = product['Nom'] || 'Produit';
    const price = product['Prix'] || 0;
    const longueur = product['Longueur'] || '';
    const largeur = product['Largeur'] || '';
    const dimensions =
      product['Dimensions'] ||
      (longueur || largeur ? `${longueur} x ${largeur}` : '');
    const img = product['Image'] || 'image/photo_a_venir.png';
    const idUnique = product['ID unique'] || product['ID'] || '';
    const productPage = `product.html?id=${idUnique}`;
    const stock =
      product['Stock'] !== undefined && product['Stock'] !== null
        ? product['Stock']
        : 0;

    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-price', price);
    card.setAttribute('data-size', longueur || 0);
    card.setAttribute('data-product', productPage);
    card.setAttribute('data-id', product['ID unique']);

    const badge = stock <= 0 ? '<div class="badge">Rupture</div>' : '';

    card.innerHTML = `
      ${badge}
      <img src="${img}" alt="${title}" class="product-media"
     onerror="this.onerror=null; this.src='image/photo_a_venir.png';">

      <div class="product-body">
        <h3 class="product-title">${title}</h3>
        <div class="product-sub">${dimensions}</div>
        <div class="meta">${
          product['Materiau'] ? product['Materiau'] + ' · ' : ''
        }Maroc</div>
        <div class="price-row">
          <div class="price">${price}</div>
          <button class="add-btn add-to-cart" type="button" ${
            stock <= 0 ? 'disabled' : ''
          }>Ajouter</button>
        </div>
      </div>
    `;
    return card;
  }

  function initProductEvents() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    const cartContent = document.querySelector('#cart-sidebar .cart-content');

    addButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = e.currentTarget.closest('.product-card');
        const name = card.querySelector('.product-title').textContent;
        const dimEl = card.querySelector('.product-sub');
        const dim = dimEl ? dimEl.textContent.trim() : '';
        const title = name;
        const price = card.querySelector('.price').textContent;
        const quantity = parseInt(card.querySelector('.qty-input')?.value) || 1;

        const productId = card.dataset.id;

        addToCartItem({
          id: productId,
          title,
          price,
          quantity,
          dimensions: dim,
        });

        // Ouvre le panier
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartSidebar && cartOverlay) {
          cartSidebar.classList.add('active');
          cartOverlay.classList.add('active');
        }
      });
    });

    // product click -> go to product page
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((c) => {
      c.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) return;
        const prod = c.getAttribute('data-product');
        if (prod) window.location.href = prod;
      });
    });
  }

  function renderProducts(products) {
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach((prod) => {
      const card = generateProductCard(prod);
      grid.appendChild(card);
    });
    updateProductCount();
    initProductEvents();
  }

  // Charge et affiche les produits (ici filtrés sur TAP)
  loadProductsFromCSV(function (allProducts) {
    let filtered = [];

    // --- ROUTAGE AUTOMATIQUE SELON LA PAGE ---
    const url = window.location.pathname;

    if (url.includes('boutique_tapis.html')) {
      filtered = filterProducts(allProducts, 'TAP');
    } else if (url.includes('boutique_deco.html')) {
      filtered = filterProducts(allProducts, 'DEC');
    } else if (url.includes('shop_tapis_azilal.html')) {
      filtered = filterProducts(allProducts, 'TAP-AZI');
    } else if (url.includes('shop_tapis_beni_ouarain.html')) {
      filtered = filterProducts(allProducts, 'TAP-BEN');
    } else if (url.includes('shop_tapis_boujad.html')) {
      filtered = filterProducts(allProducts, 'TAP-BOUJ');
    } else if (url.includes('shop_tapis_boucherouite.html')) {
      filtered = filterProducts(allProducts, 'TAP-BOUCH');
    } else if (url.includes('shop_tapis_kilim.html')) {
      filtered = filterProducts(allProducts, 'TAP-KIL');
    } else if (url.includes('shop_tapis_mrirt.html')) {
      filtered = filterProducts(allProducts, 'TAP-MRI');
    } else if (url.includes('shop_deco_abatjour.html')) {
      filtered = filterProducts(allProducts, 'DEC-ABA');
    } else if (url.includes('shop_deco_coussins.html')) {
      filtered = filterProducts(allProducts, 'DEC-COU');
    } else if (url.includes('shop_deco_lampes.html')) {
      filtered = filterProducts(allProducts, 'DEC-LAM');
    } else if (url.includes('shop_deco_miroirs.html')) {
      filtered = filterProducts(allProducts, 'DEC-MIR');
    } else if (url.includes('shop_deco_plaid.html')) {
      filtered = filterProducts(allProducts, 'DEC-PLA');
    } else if (url.includes('shop_deco_poufs.html')) {
      filtered = filterProducts(allProducts, 'DEC-POU');
    }

    // Sécurité : si rien ne correspond → affiche tout
    if (filtered.length === 0) filtered = allProducts;

    // --- RENDU ---
    renderProducts(filtered);
    renderPagination();
  });
});

function renderSingleProduct(product) {
  const container = document.getElementById('product-container');
  const heroTitle = document.getElementById('product-hero-title');
  const heroDesc = document.getElementById('product-hero-description');

  if (!container) return;

  if (!product) {
    container.innerHTML = '<p>Produit introuvable.</p>';
    if (heroTitle) heroTitle.textContent = 'Produit introuvable';
    if (heroDesc) heroDesc.textContent = '';
    return;
  }

  const title = product['Nom'] || 'Produit';
  const price = product['Prix'] || 0;
  const img = product['Image'] || 'image/photo_a_venir.png';
  const longueur = product['Longueur'] || '';
  const largeur = product['Largeur'] || '';
  const dimensions =
    product['Dimensions'] ||
    (longueur || largeur ? `${longueur} x ${largeur}` : 'Non spécifié');
  const materiau = product['Materiau'] || '';
  const stock = product['Stock'] ?? 0;
  const descrSommaire = product['Descr_sommaire'] || '';
  const descrDetail = product['Descr_detail'] || '';
  const livraison = product['Livraison'] || '';
  const entretien = product['Entretien'] || '';

  const disabled = stock <= 0 ? 'disabled' : '';

  // --- Mettre à jour le hero ---
  if (heroTitle) heroTitle.textContent = title;
  if (heroDesc)
    heroDesc.textContent = descrSommaire || `Découvrez notre produit ${title}`;

  // --- Contenu principal ---
  container.innerHTML = `
        <div class="product-page-wrapper">

            <div class="product-left">
                <img src="${img}" alt="${title}" class="product-large-image"
                     onerror="this.onerror=null; this.src='image/photo_a_venir.png';">
            </div>

            <div class="product-right">
                <h1 class="product-title">${title}</h1>

                <div class="product-meta">
                    ${materiau ? `<p>Matériau : ${materiau}</p>` : ''}
                    ${dimensions ? `<p>Dimensions : ${dimensions}</p>` : ''}
                    <p>Origine : Maroc</p>
                </div>

                <div class="product-price">${price}</div>

                ${
                  descrSommaire
                    ? `<p class="product-sommaire">${descrSommaire}</p>`
                    : ''
                }

                <!-- Sélecteur de quantité -->
                <div class="quantity-selector">
                    <button class="qty-btn minus">−</button>
                    <input type="number" class="qty-input" value="1" min="1" max="${stock}">
                    <button class="qty-btn plus">+</button>
                </div>

                <button class="add-to-cart large-btn" ${disabled}>Ajouter au panier</button>


${
  descrDetail
    ? `
<div class="accordion">
    <div class="accordion-header">
        <h3>Description</h3>
        <span class="arrow">▸</span>
    </div>
    <div class="accordion-content">
        <p>${descrDetail}</p>
    </div>
</div>`
    : ''
}

${
  livraison
    ? `
<div class="accordion">
    <div class="accordion-header">
        <h3>Livraison & Retour</h3>
        <span class="arrow">▸</span>
    </div>
    <div class="accordion-content">
        <p>${livraison}</p>
    </div>
</div>`
    : ''
}

${
  entretien
    ? `
<div class="accordion">
    <div class="accordion-header">
        <h3>Entretien</h3>
        <span class="arrow">▸</span>
    </div>
    <div class="accordion-content">
        <p>${entretien}</p>
    </div>
</div>`
    : ''
}

            </div>

        </div>
    `;
  // === Gestion quantité ===
  const minusBtn = container.querySelector('.qty-btn.minus');
  const plusBtn = container.querySelector('.qty-btn.plus');
  const qtyInput = container.querySelector('.qty-input');

  if (minusBtn && plusBtn && qtyInput) {
    const maxStock = stock ?? 1;

    minusBtn.addEventListener('click', () => {
      let v = parseInt(qtyInput.value);
      if (v > 1) qtyInput.value = v - 1;
    });

    plusBtn.addEventListener('click', () => {
      let v = parseInt(qtyInput.value);
      if (v < maxStock) qtyInput.value = v + 1;
    });

    qtyInput.addEventListener('change', () => {
      let v = parseInt(qtyInput.value);
      if (v < 1) v = 1;
      if (v > maxStock) v = maxStock;
      qtyInput.value = v;
    });
  }

  /* -------------------------
       INITIALISATION ACCORDÉONS
       ------------------------- */
  const accordions = container.querySelectorAll('.accordion');

  accordions.forEach((acc) => {
    const header = acc.querySelector('.accordion-header');
    const content = acc.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      const isOpen = acc.classList.contains('open');

      if (isOpen) {
        // Si ouvert → le fermer
        acc.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        // Si fermé → ouvrir
        acc.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  const addBtn = container.querySelector('.add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', function (e) {
      const title = container.querySelector('.product-title').textContent;
      const price = container.querySelector('.product-price').textContent;
      const quantity =
        parseInt(container.querySelector('.qty-input').value) || 1;

      const productId = product['ID unique'] || title;

      const longueur = product['Longueur'] || '';
      const largeur = product['Largeur'] || '';
      const dimensions =
        product['Dimensions'] ||
        (longueur || largeur ? `${longueur} x ${largeur}` : 'Non spécifié');
      // Ajoute le produit au sessionStorage avec dimensions
      addToCartItem({ id: productId, title, price, quantity, dimensions });

      // Ouvre le panier
      const cartSidebar = document.getElementById('cart-sidebar');
      const cartOverlay = document.getElementById('cart-overlay');
      if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
      }
    });
  }
}

// =========================
// CHARGEMENT D'UNE PAGE PRODUIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // On vérifie si on est sur product.html
  if (!window.location.pathname.includes('product.html')) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Si pas d'ID → erreur
  if (!productId) {
    renderSingleProduct(null);
    return;
  }

  // Charger CSV puis afficher ce produit uniquement
  loadProductsFromCSV(function (allProducts) {
    const product = allProducts.find(
      (p) => String(p['ID unique']) === String(productId)
    );
    renderSingleProduct(product);
  });
});

// =========================
// PAGE COMMANDE A FAIRE - METTRE LES INFOS DU PANIER ACTUEL
// =========================
/* =========================
   RENDER ORDER PAGE
   ========================= */
function renderOrderPage() {
  const cartItemsContainer = document.getElementById('cart-items');
  const summaryItems = document.getElementById('summary-items');
  const summaryTotal = document.getElementById('summary-total');

  if (!cartItemsContainer || !summaryItems || !summaryTotal) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
    summaryItems.textContent = '0 article';
    summaryTotal.textContent = '0 €';
    return;
  }

  let total = 0;
  let totalQty = 0;

  cart.forEach((item) => {
    const numericPrice =
      parseFloat(
        String(item.price)
          .replace(/[^\d.,]/g, '')
          .replace(',', '.')
      ) || 0;

    total += numericPrice * item.quantity;
    totalQty += item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.img || 'image/photo_a_venir.png'}" alt="${item.title}">
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p>${item.dimensions}</p>
        <div class="cart-item-qty">
          Qté : ${item.quantity}
        </div>
        <p>${item.price}</p>
      </div>
      <button class="remove-item" data-id="${item.id}">✖</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  summaryItems.textContent = `${totalQty} article${totalQty > 1 ? 's' : ''}`;
  summaryTotal.textContent = total.toFixed(2);
  // Gestion suppression
  cartItemsContainer.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
      renderOrderPage(); // met à jour la page après suppression
    });
  });

  // Bouton commander redirection
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
      }
      window.location.href = 'commande.html';
    });
  }
}

// Appel automatique si on est sur panier.html
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('panier.html')) {
    renderOrderPage();
  }
});
