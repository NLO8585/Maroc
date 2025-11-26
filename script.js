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

