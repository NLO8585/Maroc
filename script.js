


/* ============================================================
   === Menu hamburger (compatible accueil + annexes) ===
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const menuHome = document.querySelector(".sommaire");
    const menuAnnexes = document.querySelector(".sommaire_annexes");

    // On choisit automatiquement lequel utiliser
    const menu = menuHome || menuAnnexes;
    if (!hamburger || !menu) return;

    let isMenuOpen = false;

    const toggleMenu = (e) => {
        e.preventDefault();
        isMenuOpen = !isMenuOpen;

        menu.classList.toggle("active", isMenuOpen);
        hamburger.classList.toggle("active", isMenuOpen);
    };

    hamburger.addEventListener("click", toggleMenu);
});


/* ============================================================
   === Scroll vers section suivante ===
   ============================================================ */
window.scrollToNextSection = () => {
    const nextSection = document.querySelector(".section_blanche");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};

/* PANIER */
const cartIcon = document.querySelector('.cart-trigger'); // <-- nouvelle classe
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');

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



/* ---------- INSCRIPTION ---------- */
document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("reg-name").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const password = document.getElementById("reg-password").value.trim();

            const user = { name, email, password };

            localStorage.setItem("user", JSON.stringify(user));
            alert("Compte créé avec succès !");
            window.location.href = "login.html";
        });
    }

    /* ---------- CONNEXION ---------- */
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            const savedUser = JSON.parse(localStorage.getItem("user"));

            if (!savedUser || savedUser.email !== email || savedUser.password !== password) {
                alert("Email ou mot de passe incorrect.");
                return;
            }

            localStorage.setItem("logged", "true");
            window.location.href = "profil.html";
        });
    }

    /* ---------- PAGE PROFIL ---------- */
    if (window.location.pathname.includes("profil.html")) {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const logged = localStorage.getItem("logged");

        if (!logged) {
            window.location.href = "login.html";
        }

        document.getElementById("profile-name").textContent = savedUser.name;
        document.getElementById("profile-email").textContent = savedUser.email;

        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("logged");
            window.location.href = "login.html";
        });
    }
});


/* SOMMAIRE (Accueil + Annexes) */
const menus = document.querySelectorAll('.sommaire li.has-submenu, .sommaire_annexes li.has-submenu');

menus.forEach(menu => {
    const submenu = menu.querySelector('.submenu');

    // On ouvre le menu si la souris entre sur le parent ou le sous-menu
    const openMenu = () => {
        submenu.style.opacity = '1';
        submenu.style.pointerEvents = 'auto';
        submenu.style.transform = 'translateY(0)';
    };

    // On ferme le menu si la souris quitte le parent et le sous-menu
    const closeMenu = (e) => {
        // Vérifie si la souris est toujours dans le menu ou le parent
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

/*BOUTIQUE*/
document.addEventListener('DOMContentLoaded', function(){

  /* --- Add to Cart --- */
  const addButtons = document.querySelectorAll('.add-to-cart');
  const cartContent = document.querySelector('#cart-sidebar .cart-content');

  addButtons.forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const card = e.currentTarget.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const price = card.querySelector('.price').textContent;
      const item = document.createElement('div');
      item.className = 'mini-item';
      item.style.padding = '10px 0';
      item.style.borderBottom = '1px solid #eee';
      item.innerHTML = `<strong>${title}</strong><div style="color:#666;margin-top:6px">${price}</div>`;
      if(cartContent){
        cartContent.innerHTML = '';
        cartContent.appendChild(item);
        // open cart if needed
      }
    });
  });

  /* --- Product Click --- */
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(c=>{
    c.addEventListener('click',(e)=>{
      if(e.target.closest('.add-to-cart')) return;
      const prod = c.getAttribute('data-product');
      if(prod) window.location.href = prod;
    });
  });

  /* --- Sorting --- */
/* --- Sorting --- */
const sortSelect = document.getElementById('sort-select');
const grid = document.getElementById('products-grid');

sortSelect.addEventListener('change', function() {
  const items = Array.from(grid.children);
  const value = this.value;

  if (value === 'price-asc') {
    items.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } 
  else if (value === 'price-desc') {
    items.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  }
  else if (value === 'size-asc') {
    items.sort((a, b) => parseFloat(a.dataset.size) - parseFloat(b.dataset.size));
  }
  else if (value === 'size-desc') {
    items.sort((a, b) => parseFloat(b.dataset.size) - parseFloat(a.dataset.size));
  }

  items.forEach(item => grid.appendChild(item));
});



  /* --- Product count --- */
  const productCount = document.getElementById('product-count');
  if(productCount) productCount.textContent = grid.children.length;

});


document.addEventListener('DOMContentLoaded', function(){

  /* --- Add to Cart (reste inchangé) --- */
  const addButtons = document.querySelectorAll('.add-to-cart');
  const cartContent = document.querySelector('#cart-sidebar .cart-content');

  addButtons.forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const card = e.currentTarget.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const price = card.querySelector('.price').textContent;
      const item = document.createElement('div');
      item.className = 'mini-item';
      item.style.padding = '10px 0';
      item.style.borderBottom = '1px solid #eee';
      item.innerHTML = `<strong>${title}</strong><div style="color:#666;margin-top:6px">${price}</div>`;
      if(cartContent){
        cartContent.innerHTML = '';
        cartContent.appendChild(item);
      }
    });
  });

  /* --- Product Click (reste inchangé) --- */
  const cardsNodeList = document.querySelectorAll('.product-card');
  cardsNodeList.forEach(c=>{
    c.addEventListener('click',(e)=>{
      if(e.target.closest('.add-to-cart')) return;
      const prod = c.getAttribute('data-product');
      if(prod) window.location.href = prod;
    });
  });

  /* ---------------- Pagination & Sorting ---------------- */
  const ITEMS_PER_PAGE = 10;
  const grid = document.getElementById('products-grid');
  const sortSelect = document.getElementById('sort-select');
  const paginationContainer = document.getElementById('pagination');
  const productCountEl = document.getElementById('product-count');

  let currentPage = 1;
  // Keep a live array of items (DOM elements)
  function getItems() {
    return Array.from(grid.children);
  }

  function updateProductCount(){
    if(productCountEl) productCountEl.textContent = getItems().length;
  }

  function renderPagination() {
    const items = getItems();
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // hide pagination entirely if 1 or 0 pages
    if(totalPages <= 1){
      paginationContainer.style.display = 'none';
      // ensure all items visible
      items.forEach(it => it.style.display = 'flex');
      currentPage = 1;
      return;
    } else {
      paginationContainer.style.display = 'flex';
    }

    // clear
    paginationContainer.innerHTML = '';

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn nav';
    prevBtn.textContent = '‹'; // chevron
    prevBtn.setAttribute('aria-label', 'Page précédente');
    prevBtn.addEventListener('click', () => {
      if(currentPage > 1) {
        showPage(currentPage - 1);
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Page number buttons
    for(let i=1; i<= totalPages; i++){
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      btn.setAttribute('data-page', i);
      btn.addEventListener('click', () => {
        showPage(i);
      });
      paginationContainer.appendChild(btn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn nav';
    nextBtn.textContent = '›';
    nextBtn.setAttribute('aria-label', 'Page suivante');
    nextBtn.addEventListener('click', () => {
      if(currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    });
    paginationContainer.appendChild(nextBtn);

    // default to first page
    showPage(1);
  }

  function showPage(page){
    const items = getItems();
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // clamp page
    if(page < 1) page = 1;
    if(page > totalPages) page = totalPages;

    currentPage = page;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    items.forEach((item, idx) => {
      item.style.display = (idx >= start && idx < end) ? 'flex' : 'none';
    });

    // Update buttons state (active / disabled)
    const btns = Array.from(paginationContainer.querySelectorAll('.page-btn'));
    const prevBtn = btns[0];
    const nextBtn = btns[btns.length - 1];
    const numberBtns = btns.slice(1, btns.length - 1);

    numberBtns.forEach((b, i) => {
      const pageNum = i + 1;
      if(pageNum === page){
        b.classList.add('active');
        b.setAttribute('aria-current', 'page');
      } else {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      }
    });

    if(page <= 1){
      prevBtn.classList.add('disabled');
      prevBtn.setAttribute('aria-disabled', 'true');
    } else {
      prevBtn.classList.remove('disabled');
      prevBtn.removeAttribute('aria-disabled');
    }

    if(page >= totalPages){
      nextBtn.classList.add('disabled');
      nextBtn.setAttribute('aria-disabled', 'true');
    } else {
      nextBtn.classList.remove('disabled');
      nextBtn.removeAttribute('aria-disabled');
    }

    if(totalPages <= 1){
      paginationContainer.style.display = 'none';
    } else {
      paginationContainer.style.display = 'flex';
    }

    // ← AJOUT : remonter en haut du conteneur ou page
    window.scrollTo({
      top: 0,      // remonte en haut de la page
      behavior: 'smooth'  // animation fluide
    });
}


  // Sorting function (keeps pagination in sync)
  function applySort(value){
    const items = getItems();
    if(value === 'price-asc'){
      items.sort((a,b)=>parseFloat(a.dataset.price||0) - parseFloat(b.dataset.price||0));
    } else if(value === 'price-desc'){
      items.sort((a,b)=>parseFloat(b.dataset.price||0) - parseFloat(a.dataset.price||0));
    } else {
      // default: keep existing DOM order (no-op) or you may restore original order if you stored it
    }
    // re-append sorted items
    items.forEach(item => grid.appendChild(item));
    // re-render pagination from page 1
    renderPagination();
  }

  // Init
  updateProductCount();
  renderPagination();

  // Re-apply sort when select changes
  if(sortSelect){
    sortSelect.addEventListener('change', function(){
      applySort(this.value);
      // update count just in case
      updateProductCount();
    });
  }

  // If you dynamically add/remove items later, call:
  // updateProductCount(); renderPagination();

});
