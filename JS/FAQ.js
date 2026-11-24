
/* =========================================================
   NOAH'S ARK INTERNATIONAL SCHOOL
   FAQ PAGE — INTEGRATED JAVASCRIPT
   File: ../JS/FAQ.js

   FEATURES
   01. Persistent light/dark theme
   02. Responsive mobile navigation
   03. Navbar scroll effect and back-to-top
   04. FAQ category filters and live search
   05. FAQ accordion behavior
   06. Accessible enquiry modal
   07. Local demo enquiry storage
   08. Toast notifications and footer year
========================================================= */

(() => {
  "use strict";

  function initFAQPage() {
    const root = document.documentElement;
    const body = document.body;

    /* =====================================================
       01. SHARED ELEMENTS AND TOAST NOTIFICATIONS
    ===================================================== */

    const navbar = document.getElementById("navbar");
    const backToTop = document.getElementById("backToTop");

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");

    let toastTimer = null;
    let lastFocusedElement = null;

    function showToast(title, message, type = "success") {
      if (!toast) return;

      if (toastTitle) {
        toastTitle.textContent = title;
      }

      if (toastMessage) {
        toastMessage.textContent = message;
      }

      if (toastIcon) {
        toastIcon.innerHTML =
          type === "error"
            ? '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
      }

      toast.classList.add("show");
      toast.setAttribute("aria-hidden", "false");

      if (toastTimer) {
        window.clearTimeout(toastTimer);
      }

      toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.setAttribute("aria-hidden", "true");
      }, 3500);
    }

    /* =====================================================
       02. LIGHT / DARK THEME TOGGLE
    ===================================================== */

    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");

    function updateThemeUI() {
      const isLight = root.classList.contains("light-theme");

      if (sunIcon) {
        sunIcon.style.visibility = isLight ? "hidden" : "visible";
        sunIcon.style.opacity = isLight ? "0" : "1";
      }

      if (moonIcon) {
        moonIcon.style.visibility = isLight ? "visible" : "hidden";
        moonIcon.style.opacity = isLight ? "1" : "0";
      }

      if (themeToggle) {
        const label = isLight
          ? "Switch to dark mode"
          : "Switch to light mode";

        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
        themeToggle.setAttribute("aria-pressed", String(isLight));
      }
    }

    // Restore the saved theme.
    try {
      root.classList.toggle(
        "light-theme",
        localStorage.getItem("rsh-theme") === "light"
      );
    } catch (error) {
      console.warn("Could not restore the saved theme.", error);
    }

    updateThemeUI();

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isLight = root.classList.toggle("light-theme");

        try {
          localStorage.setItem(
            "rsh-theme",
            isLight ? "light" : "dark"
          );
        } catch (error) {
          console.warn("Could not save the theme preference.", error);
        }

        updateThemeUI();
      });
    }

    /* =====================================================
       03. RESPONSIVE MOBILE NAVIGATION
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const menuPanel = document.getElementById("menuPanel");

    function setMenu(open) {
      if (!menuButton || !menuPanel) return;

      menuPanel.classList.toggle("menu-open", open);

      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );

      menuPanel.setAttribute("aria-hidden", String(!open));

      menuPanel.querySelectorAll("a").forEach((link) => {
        link.tabIndex = open ? 0 : -1;
      });

      menuButton.querySelectorAll(".menu-line").forEach((line, index) => {
        if (index === 0) {
          line.style.transform = open
            ? "translateY(6px) rotate(45deg)"
            : "";
        }

        if (index === 1) {
          line.style.opacity = open ? "0" : "";
        }

        if (index === 2) {
          line.style.transform = open
            ? "translateY(-6px) rotate(-45deg)"
            : "";
        }
      });
    }

    if (menuButton && menuPanel) {
      // Start with the menu closed.
      setMenu(false);

      menuButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen =
          menuButton.getAttribute("aria-expanded") === "true";

        setMenu(!isOpen);
      });

      // Close the menu after selecting a navigation link.
      menuPanel.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (link) {
          setMenu(false);
        }
      });

      // Close the menu when clicking outside it.
      document.addEventListener("click", (event) => {
        if (
          !menuButton.contains(event.target) &&
          !menuPanel.contains(event.target)
        ) {
          setMenu(false);
        }
      });

      // Close the menu using Escape.
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          setMenu(false);
        }
      });

      // Tailwind's lg breakpoint starts at 1024px.
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
          setMenu(false);
        }
      });
    }

    /* =====================================================
       04. NAVBAR SCROLL EFFECT AND BACK TO TOP
    ===================================================== */

    function handleScroll() {
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      }

      if (backToTop) {
        backToTop.classList.toggle("show", window.scrollY > 500);
      }
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    handleScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }

    const footerYear = document.getElementById("footerCopyrightYear");

    if (footerYear) {
      footerYear.textContent = String(new Date().getFullYear());
    }

    /* =====================================================
       05. FAQ CATEGORY FILTER AND LIVE SEARCH
    ===================================================== */

    const faqSearch = document.getElementById("faqSearch");

    const faqCategories = Array.from(
      document.querySelectorAll(".faq-category")
    );

    const faqGroups = Array.from(
      document.querySelectorAll(".faq-group")
    );

    const faqItems = Array.from(
      document.querySelectorAll(".faq-item")
    );

    const faqEmptyState = document.getElementById("faqEmptyState");
    const searchResultsInfo = document.getElementById("searchResultsInfo");

    let activeCategory =
      document.querySelector(".faq-category.active")?.dataset.category ||
      "admissions";

    function categoryLabel(category) {
      const button = faqCategories.find(
        (item) => item.dataset.category === category
      );

      return button
        ? button.textContent.trim().replace(/\s+/g, " ")
        : category;
    }

    function renderFAQs() {
      const query = faqSearch
        ? faqSearch.value.trim().toLocaleLowerCase()
        : "";

      let visibleQuestions = 0;

      faqCategories.forEach((button) => {
        const active = button.dataset.category === activeCategory;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      faqGroups.forEach((group) => {
        const category = group.dataset.group;
        const matchesCategory = category === activeCategory;

        const groupItems = Array.from(
          group.querySelectorAll(".faq-item")
        );

        let groupMatches = 0;

        groupItems.forEach((item) => {
          const text = item.textContent.toLocaleLowerCase();
          const matchesSearch = !query || text.includes(query);

          // Searching checks all categories.
          // Without a search, show the selected category.
          const showItem = query
            ? matchesSearch
            : matchesCategory;

          item.style.display = showItem ? "" : "none";

          if (!showItem) {
            item.open = false;
          }

          if (showItem) {
            groupMatches++;
            visibleQuestions++;
          }
        });

        const showGroup = query
          ? groupMatches > 0
          : matchesCategory;

        group.style.display = showGroup ? "" : "none";
        group.classList.toggle("active", showGroup);
      });

      if (faqEmptyState) {
        faqEmptyState.style.display =
          visibleQuestions > 0 ? "none" : "block";
      }

      if (searchResultsInfo) {
        if (query) {
          searchResultsInfo.textContent =
            `${visibleQuestions} question` +
            `${visibleQuestions === 1 ? "" : "s"} found` +
            (
              visibleQuestions
                ? ` for “${faqSearch.value.trim()}”`
                : ""
            );
        } else {
          searchResultsInfo.textContent =
            `Showing ${categoryLabel(activeCategory)} questions`;
        }
      }
    }

    // Category buttons.
    faqCategories.forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        if (faqSearch) {
          faqSearch.value = "";
        }

        renderFAQs();
      });
    });

    // Search as the visitor types.
    if (faqSearch) {
      faqSearch.addEventListener("input", renderFAQs);
      faqSearch.addEventListener("search", renderFAQs);
    }

    // Allow only one expanded FAQ per category.
    faqItems.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;

        const parentGroup = item.closest(".faq-group");

        if (!parentGroup) return;

        parentGroup.querySelectorAll(".faq-item").forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      });
    });

    renderFAQs();

/* =====================================================
   07. EMAILJS ADMISSIONS ENQUIRY SUBMISSION
===================================================== */

const EMAILJS_PUBLIC_KEY = "vF7ID9vsgwJvVNMHy";
const EMAILJS_SERVICE_ID = "service_tpi8qt2";
const EMAILJS_TEMPLATE_ID = "template_t7qdmhl";

// Initialize EmailJS.
if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) {
      return;
    }

    if (typeof emailjs === "undefined") {
      showToast(
        "Email service unavailable",
        "Please refresh the page and try again.",
        "error"
      );
      return;
    }

    const formData = new FormData(inquiryForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const question = String(formData.get("question") || "").trim();

    if (!name || !email || !question) {
      if (inquiryStatus) {
        inquiryStatus.textContent =
          "Please complete all fields.";

        inquiryStatus.className = "inquiry-status error";
      }
      return;
    }

    const submitButton = inquiryForm.querySelector(
      'button[type="submit"]'
    );

    if (!submitButton) {
      console.error("Submit button not found.");
      return;
    }

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';

    if (inquiryStatus) {
      inquiryStatus.textContent = "Sending your enquiry...";
      inquiryStatus.className = "inquiry-status";
    }

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        inquiryForm
      );

      if (inquiryStatus) {
        inquiryStatus.textContent =
          "Thank you! Your enquiry has been sent successfully. Our admissions team will get back to you.";
        inquiryStatus.className = "inquiry-status success";
      }

      inquiryForm.reset();

      showToast(
        "Enquiry sent successfully",
        "Thank you for contacting Noah's Ark International School."
      );

      window.setTimeout(() => {
        const panel = document.getElementById("inquiryPanel");

        if (panel && panel.classList.contains("active")) {
          document.getElementById("closeInquiry")?.click();
        }
      }, 1800);

    } catch (error) {
      console.error("EmailJS submission failed:", error);

      if (inquiryStatus) {
        inquiryStatus.textContent =
          "Your enquiry could not be sent. Please try again.";
        inquiryStatus.className = "inquiry-status error";
      }

      showToast(
        "Enquiry not sent",
        "Please check your connection and try again.",
        "error"
      );

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });
}


    /* =====================================================
       08. INITIAL ACCESSIBILITY STATE
    ===================================================== */

    if (menuPanel) {
      menuPanel.setAttribute("aria-hidden", "true");
    }

    if (inquiryModal) {
      inquiryModal.setAttribute("aria-hidden", "true");
    }

    if (toast) {
      toast.setAttribute("aria-hidden", "true");
    }
  }

  // Initialize safely whether the script loads before or after
  // the HTML document has finished loading.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initFAQPage,
      { once: true }
    );
  } else {
    initFAQPage();
  }
})();

// =====================================================
// CURRENT PAGE INDICATOR
// Automatically displays the current page name
// =====================================================

(() => {
    "use strict";

    const pageNameElement = document.getElementById("currentPageName");

    if (!pageNameElement) return;

    const fileName = window.location.pathname
        .split("/")
        .filter(Boolean)
        .pop() || "index.html";

    const pageName = fileName
        .replace(/\.html?$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

    const pageLabels = {
        "index": "Home",
        "apply now": "Apply Now",
        "noahs ark mvv": "Mission, Vision & Values",
        "our programs": "Our Programs",
        "experience": "Experience",
        "faq": "Frequently Asked Questions",
        "contact": "Contact Us"
    };

    pageNameElement.textContent =
        pageLabels[pageName.toLowerCase()] || pageName;
})();
/* =========================================
   ADMISSIONS INQUIRY PANEL
========================================= */

(() => {
    "use strict";

    const openButton = document.getElementById("openInquiry");
    const closeButton = document.getElementById("closeInquiry");

    const inquiryPanel = document.getElementById("inquiryPanel");
    const inquiryOverlay = document.getElementById("inquiryOverlay");

    const inquiryForm = document.getElementById("inquiryForm");
    const inquiryStatus = document.getElementById("inquiryStatus");

    if (
        !openButton ||
        !closeButton ||
        !inquiryPanel ||
        !inquiryOverlay ||
        !inquiryForm
    ) return;


    let previousFocus = null;


    /* OPEN PANEL */

    function openInquiry() {

        previousFocus = document.activeElement;

        inquiryPanel.inert = false;

        inquiryPanel.classList.add("active");
        inquiryOverlay.classList.add("active");

        document.body.classList.add("inquiry-open");

        inquiryPanel.setAttribute("aria-hidden", "false");
        inquiryOverlay.setAttribute("aria-hidden", "false");

        openButton.setAttribute("aria-expanded", "true");

        setTimeout(() => {
            document.getElementById("inquiryName")?.focus();
        }, 150);
    }


    /* CLOSE PANEL */

    function closeInquiry() {

        inquiryPanel.classList.remove("active");
        inquiryOverlay.classList.remove("active");

        document.body.classList.remove("inquiry-open");

        inquiryPanel.setAttribute("aria-hidden", "true");
        inquiryOverlay.setAttribute("aria-hidden", "true");

        inquiryPanel.inert = true;

        openButton.setAttribute("aria-expanded", "false");

        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus();
        }
    }


    /* BUTTON EVENTS */

    openButton.addEventListener("click", openInquiry);

    closeButton.addEventListener("click", closeInquiry);

    inquiryOverlay.addEventListener("click", closeInquiry);


    /* ESCAPE KEY */

    document.addEventListener("keydown", (event) => {

        if (!inquiryPanel.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeInquiry();
        }

    });


    /* FORM SUBMISSION */

    inquiryForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!inquiryForm.checkValidity()) {
            inquiryForm.reportValidity();
            return;
        }

        inquiryStatus.textContent =
            "Thank you! Your enquiry has been prepared successfully.";

        inquiryStatus.className = "inquiry-status success";

        // This is currently a front-end demonstration.
        // Connect a backend or email service for real submission.

    });

})();