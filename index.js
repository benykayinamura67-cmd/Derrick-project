/* =========================================================
   DARK / LIGHT THEME
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");

    if (!themeToggle) return;


    /* -----------------------------------------
       LOAD SAVED THEME
    ----------------------------------------- */

    const savedTheme = localStorage.getItem("rsh-theme");

    if (savedTheme === "light") {
        document.documentElement.classList.add("light-theme");
    }


    /* -----------------------------------------
       UPDATE ICON
    ----------------------------------------- */

    function updateThemeIcon() {

        const isLight =
            document.documentElement.classList.contains("light-theme");

        if (isLight) {

            // Light mode → show moon
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );

        } else {

            // Dark mode → show sun
            sunIcon.classList.remove("hidden");
            moonIcon.classList.add("hidden");

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );
        }
    }


    /* -----------------------------------------
       TOGGLE
    ----------------------------------------- */

    themeToggle.addEventListener("click", () => {

        const isLight =
            document.documentElement.classList.toggle("light-theme");

        localStorage.setItem(
            "rsh-theme",
            isLight ? "light" : "dark"
        );

        updateThemeIcon();
    });


    /* -----------------------------------------
       INITIAL ICON
    ----------------------------------------- */

    updateThemeIcon();

});
const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");

const menuLines = menuButton.querySelectorAll(".menu-line");

menuButton.addEventListener("click", () => {

  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  menuButton.setAttribute("aria-expanded", !isOpen);

  if (!isOpen) {

    // Open menu
    menuPanel.classList.remove(
      "opacity-0",
      "scale-95",
      "pointer-events-none"
    );

    menuPanel.classList.add(
      "opacity-100",
      "scale-100"
    );

    // Turn hamburger into X
    menuLines[0].classList.add(
      "rotate-45",
      "translate-y-2"
    );

    menuLines[1].classList.add(
      "opacity-0"
    );

    menuLines[2].classList.add(
      "-rotate-45",
      "-translate-y-2"
    );

  } else {

    // Close menu
    menuPanel.classList.add(
      "opacity-0",
      "scale-95",
      "pointer-events-none"
    );

    menuPanel.classList.remove(
      "opacity-100",
      "scale-100"
    );

    // Turn X back into hamburger
    menuLines[0].classList.remove(
      "rotate-45",
      "translate-y-2"
    );

    menuLines[1].classList.remove(
      "opacity-0"
    );

    menuLines[2].classList.remove(
      "-rotate-45",
      "-translate-y-2"
    );
  }
});
/* =====================================================
   EDITORIAL IMAGE CAROUSEL — FIVE SLIDES
===================================================== */

(() => {
    const carousel = document.getElementById("heroEditorialCarousel");

    if (!carousel || carousel.dataset.initialized === "true") return;

    const slides = [...carousel.querySelectorAll(".hero-carousel-slide")];
    const prevButton = carousel.querySelector(".hero-carousel-prev");
    const nextButton = carousel.querySelector(".hero-carousel-next");
    const currentCounter = document.getElementById("heroSlideCurrent");

    if (!slides.length || !prevButton || !nextButton) return;

    carousel.dataset.initialized = "true";

    let currentIndex = Math.max(
        0,
        slides.findIndex(slide => slide.classList.contains("is-active"))
    );

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === currentIndex;

            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });

        if (currentCounter) {
            currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
        }
    }

    prevButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    // Support touch swiping on phones and tablets.

    let touchStartX = 0;
    let touchStartY = 0;

    carousel.addEventListener("touchstart", event => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    carousel.addEventListener("touchend", event => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;

        showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    showSlide(currentIndex);
})();