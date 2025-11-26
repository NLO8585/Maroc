/* ============================================================
   === Apparition du menu / sommaire (Accueil + Annexes) ===
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const sommaireHome = document.querySelector(".sommaire");
    const sommaireAnnexes = document.querySelector(".sommaire_annexes");

    const isHome =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "";

    // === PAGE D’ACCUEIL ===
    if (sommaireHome && isHome) {
        setTimeout(() => {
            sommaireHome.classList.add("show");
        }, 300);
    }

    // === PAGES ANNEXES ===
    if (sommaireAnnexes && !isHome) {
        sommaireAnnexes.classList.add("static");
}
});


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
    const nextSection = document.querySelector("#contact-section");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};

/*PANIER*/
const cartIcon = document.querySelector('.cart-icon');
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