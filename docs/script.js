/* === Apparition du menu / sommaire === */
document.addEventListener("DOMContentLoaded", () => {
    const sommaire = document.querySelector(".sommaire");
    if (!sommaire) return;

    // Animation pour la page d'accueil
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        setTimeout(() => {
            sommaire.classList.add("show");
        }, 300);
    } else {
        sommaire.classList.add("static");
    }
});

/* === Menu hamburger === */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".sommaire");
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

/* === Scroll vers section suivante === */
window.scrollToNextSection = () => {
    const nextSection = document.querySelector("#contact-section");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};
