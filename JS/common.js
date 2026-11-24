
/* =========================================================
   01. GLOBAL THEME TOGGLE
   Shared across all Noah's Ark pages
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const sun = document.getElementById("sunIcon");
    const moon = document.getElementById("moonIcon");

    const STORAGE_KEY = "rsh-theme";

    // Restore the saved theme on every page.
    function applyTheme(theme) {
        const isLight = theme === "light";

        root.classList.toggle("light-theme", isLight);

        // Update the toggle icons.
        sun?.classList.toggle("hidden", isLight);
        moon?.classList.toggle("hidden", !isLight);

        // Update accessibility labels.
        if (toggle) {
            const label = `Switch to ${isLight ? "dark" : "light"} mode`;

            toggle.setAttribute("aria-label", label);
            toggle.setAttribute("title", label);
            toggle.setAttribute("aria-pressed", String(isLight));
        }
    }

    // Read the saved preference.
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "light"
                ? "light"
                : "dark";
        } catch (error) {
            return "dark";
        }
    }

    // Apply the saved preference when each page loads.
    applyTheme(getSavedTheme());

    // Change and save the theme when the button is clicked.
    toggle?.addEventListener("click", () => {
        const nextTheme = root.classList.contains("light-theme")
            ? "dark"
            : "light";

        applyTheme(nextTheme);

        try {
            localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }
    });

    // Synchronize an already-open page when another tab changes the theme.
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY) {
            applyTheme(event.newValue === "light" ? "light" : "dark");
        }
    });
});
