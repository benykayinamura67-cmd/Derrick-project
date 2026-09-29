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