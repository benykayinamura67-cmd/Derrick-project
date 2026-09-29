/* =========================================================
   FAQ PAGE JAVASCRIPT
   Noah's Ark International School
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================== */

    const html = document.documentElement;
    const body = document.body;

    const navbar =
        document.getElementById("mainNavbar");

    const menuToggle =
        document.getElementById("menuToggle");

    const navigationMenu =
        document.getElementById("navigationMenu");

    const menuIcon =
        document.getElementById("menuIcon");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const faqSearch =
        document.getElementById("faqSearch");

    const faqCategories =
        document.querySelectorAll(".faq-category");

    const faqGroups =
        document.querySelectorAll(".faq-group");

    const faqItems =
        document.querySelectorAll(".faq-item");

    const searchResultsInfo =
        document.getElementById("searchResultsInfo");

    const faqEmptyState =
        document.getElementById("faqEmptyState");

    const inquiryModal =
        document.getElementById("inquiryModal");

    const inquiryForm =
        document.getElementById("inquiryForm");

    const inquiryStatus =
        document.getElementById("inquiryStatus");

    const newsletterForm =
        document.getElementById("newsletterForm");

    const newsletterStatus =
        document.getElementById("newsletterStatus");

    const footer =
        document.getElementById("footer");

    const footerCustomizerToggle =
        document.getElementById("footerCustomizerToggle");

    const footerColorPanel =
        document.getElementById("footerColorPanel");

    const footerSwatches =
        document.querySelectorAll(".footer-color-swatch");

    const activeFooterColor =
        document.getElementById("activeFooterColor");

    const backToTop =
        document.getElementById("backToTop");

    const toast =
        document.getElementById("toast");


    /* =========================================================
       STATE
    ========================================================== */

    let activeCategory = "admissions";

    let lastFocusedElement = null;

    let toastTimer = null;


    /* =========================================================
       TOAST
    ========================================================== */

    function showToast(
        title,
        message,
        type = "success"
    ) {

        const toastTitle =
            document.getElementById("toastTitle");

        const toastMessage =
            document.getElementById("toastMessage");

        const toastIcon =
            document.getElementById("toastIcon");


        toastTitle.textContent = title;

        toastMessage.textContent = message;


        if (type === "error") {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-circle-exclamation"></i>';

            toastIcon.className =
                "text-red-400 mt-0.5";

        } else {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>';

            toastIcon.className =
                "text-[#D6B56A] mt-0.5";
        }


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3500);
    }


    /* =========================================================
       MENU
    ========================================================== */

    function openMenu() {

        navigationMenu.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        menuIcon.className =
            "fa-solid fa-xmark";
    }


    function closeMenu() {

        navigationMenu.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuIcon.className =
            "fa-solid fa-bars";
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                if (
                    navigationMenu.classList.contains(
                        "menu-open"
                    )
                ) {

                    closeMenu();

                } else {

                    openMenu();
                }
            }
        );
    }


    document.addEventListener(
        "click",
        (event) => {

            if (
                navigationMenu &&
                menuToggle &&
                navigationMenu.classList.contains(
                    "menu-open"
                ) &&
                !navigationMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                closeMenu();
            }
        }
    );


    document
        .querySelectorAll("[data-menu-link]")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu();

                }
            );

        });


    /* =========================================================
       MENU ENQUIRE
    ========================================================== */

    const menuEnquire =
        document.getElementById("menuEnquire");

    if (menuEnquire) {

        menuEnquire.addEventListener(
            "click",
            () => {

                closeMenu();

                openInquiry();

            }
        );
    }


    /* =========================================================
       THEME
    ========================================================== */

    function updateThemeIcon() {

        const isLight =
            html.classList.contains(
                "light-theme"
            );


        if (isLight) {

            themeIcon.className =
                "fa-solid fa-moon text-sm";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );

        } else {

            themeIcon.className =
                "fa-solid fa-sun text-sm";

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


    function loadTheme() {

        const savedTheme =
            localStorage.getItem(
                "schoolTheme"
            );


        if (savedTheme === "light") {

            html.classList.add(
                "light-theme"
            );

        } else {

            html.classList.remove(
                "light-theme"
            );
        }


        updateThemeIcon();
    }


    function toggleTheme() {

        const isLight =
            html.classList.toggle(
                "light-theme"
            );


        localStorage.setItem(
            "schoolTheme",
            isLight
                ? "light"
                : "dark"
        );


        updateThemeIcon();


        showToast(
            "Theme Updated",
            isLight
                ? "Light mode is now active."
                : "Dark mode is now active."
        );
    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            toggleTheme
        );
    }


    loadTheme();


    /* =========================================================
       NAVBAR SCROLL
    ========================================================== */

    function handleScroll() {

        const scrollY =
            window.scrollY;


        if (navbar) {

            if (scrollY > 40) {

                navbar.classList.add(
                    "scrolled"
                );

            } else {

                navbar.classList.remove(
                    "scrolled"
                );
            }
        }


        if (backToTop) {

            if (scrollY > 500) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );
            }
        }
    }


    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );


    handleScroll();


    /* =========================================================
       FAQ CATEGORY
    ========================================================== */

    function closeAllFaqItems() {

        faqItems.forEach(item => {

            item.removeAttribute("open");

        });
    }


    function setActiveCategory(
        category
    ) {

        activeCategory =
            category;


        faqCategories.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                category
            );

        });


        faqGroups.forEach(group => {

            group.classList.toggle(
                "active",
                group.dataset.group ===
                category
            );

        });


        closeAllFaqItems();


        const activeButton =
            [...faqCategories]
                .find(
                    button =>
                        button.dataset.category ===
                        category
                );


        if (
            activeButton &&
            searchResultsInfo
        ) {

            const categoryName =
                activeButton.textContent.trim();

            searchResultsInfo.textContent =
                `Showing ${categoryName} questions`;
        }


        if (faqEmptyState) {

            faqEmptyState.style.display =
                "none";
        }
    }


    faqCategories.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (faqSearch) {

                    faqSearch.value = "";
                }

                resetFaqItemDisplay();

                setActiveCategory(
                    button.dataset.category
                );


                const faqContainer =
                    document.getElementById(
                        "faqContainer"
                    );

                if (faqContainer) {

                    faqContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            }
        );

    });


    /* =========================================================
       FAQ ACCORDION
    ========================================================== */

    faqItems.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (item.open) {

                    faqItems.forEach(
                        otherItem => {

                            if (
                                otherItem !== item &&
                                otherItem.open
                            ) {

                                otherItem.removeAttribute(
                                    "open"
                                );
                            }

                        }
                    );
                }

            }
        );

    });


    /* =========================================================
       FAQ SEARCH
    ========================================================== */

    function searchFAQs(
        searchTerm
    ) {

        const term =
            searchTerm
                .trim()
                .toLowerCase();


        if (!term) {

            resetFaqItemDisplay();

            setActiveCategory(
                activeCategory
            );

            return;
        }


        let totalMatches = 0;


        faqCategories.forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


        faqGroups.forEach(group => {

            let groupMatches = 0;


            const items =
                group.querySelectorAll(
                    ".faq-item"
                );


            items.forEach(item => {

                const text =
                    item.textContent
                        .toLowerCase();


                const matches =
                    text.includes(term);


                item.style.display =
                    matches
                        ? ""
                        : "none";


                if (matches) {

                    groupMatches++;

                    totalMatches++;
                }

            });


            group.classList.toggle(
                "active",
                groupMatches > 0
            );


            if (groupMatches === 0) {

                group.style.display =
                    "none";

            } else {

                group.style.display =
                    "block";
            }

        });


        closeAllFaqItems();


        if (totalMatches === 0) {

            if (faqEmptyState) {

                faqEmptyState.style.display =
                    "block";
            }

            if (searchResultsInfo) {

                searchResultsInfo.textContent =
                    `No results for "${searchTerm}"`;
            }

        } else {

            if (faqEmptyState) {

                faqEmptyState.style.display =
                    "none";
            }

            if (searchResultsInfo) {

                searchResultsInfo.textContent =
                    `${totalMatches} question${
                        totalMatches === 1
                            ? ""
                            : "s"
                    } found for "${searchTerm}"`;
            }
        }
    }


    if (faqSearch) {

        faqSearch.addEventListener(
            "input",
            event => {

                searchFAQs(
                    event.target.value
                );

            }
        );
    }


    /* =========================================================
       RESET FAQ ITEM DISPLAY
    ========================================================== */

    function resetFaqItemDisplay() {

        faqItems.forEach(item => {

            item.style.display = "";

        });


        faqGroups.forEach(group => {

            group.style.display = "";

        });
    }


    /* =========================================================
       INQUIRY MODAL
    ========================================================== */

    function openInquiry() {

        if (!inquiryModal) {
            return;
        }


        lastFocusedElement =
            document.activeElement;


        inquiryModal.classList.add(
            "modal-open"
        );


        inquiryModal.setAttribute(
            "aria-hidden",
            "false"
        );


        body.classList.add(
            "modal-open"
        );


        setTimeout(() => {

            const inquiryName =
                document.getElementById(
                    "inquiryName"
                );

            if (inquiryName) {

                inquiryName.focus();
            }

        }, 100);
    }


    function closeInquiry() {

        if (!inquiryModal) {
            return;
        }


        inquiryModal.classList.remove(
            "modal-open"
        );


        inquiryModal.setAttribute(
            "aria-hidden",
            "true"
        );


        body.classList.remove(
            "modal-open"
        );


        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus ===
            "function"
        ) {

            lastFocusedElement.focus();
        }
    }


    const openInquiryButton =
        document.getElementById("openInquiry");

    if (openInquiryButton) {

        openInquiryButton.addEventListener(
            "click",
            openInquiry
        );
    }


    const emptyStateEnquire =
        document.getElementById("emptyStateEnquire");

    if (emptyStateEnquire) {

        emptyStateEnquire.addEventListener(
            "click",
            openInquiry
        );
    }


    const closeInquiryButton =
        document.getElementById("closeInquiry");

    if (closeInquiryButton) {

        closeInquiryButton.addEventListener(
            "click",
            closeInquiry
        );
    }


    document
        .querySelectorAll(
            "[data-footer-inquiry]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                openInquiry
            );

        });


    /* =========================================================
       INQUIRY FORM
    ========================================================== */

    if (inquiryForm) {

        inquiryForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const formData =
                    new FormData(
                        inquiryForm
                    );


                const name =
                    formData.get("name")
                        ?.toString()
                        .trim() || "";


                const email =
                    formData.get("email")
                        ?.toString()
                        .trim() || "";


                const question =
                    formData.get("question")
                        ?.toString()
                        .trim() || "";


                if (
                    !name ||
                    !email ||
                    !question
                ) {

                    showFormStatus(
                        inquiryStatus,
                        "Please complete all fields.",
                        "error"
                    );

                    return;
                }


                const inquiry = {

                    id:
                        `INQ-${Date.now()}`,

                    name,

                    email,

                    question,

                    createdAt:
                        new Date()
                            .toISOString()
                };


                const existing =
                    JSON.parse(
                        localStorage.getItem(
                            "schoolInquiries"
                        ) || "[]"
                    );


                existing.push(
                    inquiry
                );


                localStorage.setItem(
                    "schoolInquiries",
                    JSON.stringify(
                        existing
                    )
                );


                showFormStatus(
                    inquiryStatus,
                    "Thank you. Your enquiry has been recorded successfully.",
                    "success"
                );


                inquiryForm.reset();


                showToast(
                    "Enquiry Received",
                    "Your question has been saved successfully."
                );


                setTimeout(
                    closeInquiry,
                    1800
                );
            }
        );
    }


    /* =========================================================
       FORM STATUS
    ========================================================== */

    function showFormStatus(
        element,
        message,
        type
    ) {

        if (!element) {
            return;
        }


        element.textContent =
            message;


        element.className =
            `status-message show ${
                type === "success"
                    ? "status-success"
                    : "status-error"
            }`;
    }


    /* =========================================================
       NEWSLETTER
    ========================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "newsletterEmail"
                    );


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                if (!email) {

                    showFormStatus(
                        newsletterStatus,
                        "Please enter your email address.",
                        "error"
                    );

                    return;
                }


                const subscriptions =
                    JSON.parse(
                        localStorage.getItem(
                            "schoolNewsletter"
                        ) || "[]"
                    );


                if (
                    !subscriptions.includes(
                        email
                    )
                ) {

                    subscriptions.push(
                        email
                    );
                }


                localStorage.setItem(
                    "schoolNewsletter",
                    JSON.stringify(
                        subscriptions
                    )
                );


                showFormStatus(
                    newsletterStatus,
                    "You're subscribed. Thank you for staying connected.",
                    "success"
                );


                newsletterForm.reset();


                showToast(
                    "Subscription Complete",
                    "You'll receive school updates in this demo."
                );
            }
        );
    }


    /* =========================================================
       FOOTER COLOR CUSTOMIZER
    ========================================================== */

    const defaultFooter = {

        name: "Forest Gold",

        primary: "#071A12",

        secondary: "#0B241B"
    };


    function isValidFooterColor(
        data
    ) {

        return (
            data &&
            typeof data.name === "string" &&
            typeof data.primary === "string" &&
            typeof data.secondary === "string" &&
            /^#[0-9A-F]{6}$/i.test(
                data.primary
            ) &&
            /^#[0-9A-F]{6}$/i.test(
                data.secondary
            )
        );
    }


    function applyFooterColor(
        data,
        save = true
    ) {

        if (
            !isValidFooterColor(data)
        ) {

            data =
                defaultFooter;
        }


        if (footer) {

            footer.style.setProperty(
                "--footer-primary",
                data.primary
            );


            footer.style.setProperty(
                "--footer-secondary",
                data.secondary
            );
        }


        if (activeFooterColor) {

            activeFooterColor.textContent =
                data.name;
        }


        footerSwatches.forEach(
            swatch => {

                swatch.classList.toggle(
                    "active",
                    swatch.dataset.footerName ===
                    data.name
                );

            }
        );


        if (save) {

            localStorage.setItem(
                "footerColor",
                JSON.stringify(data)
            );
        }
    }


    function loadFooterColor() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "footerColor"
                    )
                );


            if (
                isValidFooterColor(saved)
            ) {

                applyFooterColor(
                    saved,
                    false
                );

            } else {

                applyFooterColor(
                    defaultFooter,
                    false
                );
            }

        } catch {

            applyFooterColor(
                defaultFooter,
                false
            );
        }
    }


    footerSwatches.forEach(
        swatch => {

            swatch.addEventListener(
                "click",
                () => {

                    const data = {

                        name:
                            swatch.dataset.footerName,

                        primary:
                            swatch.dataset.footerPrimary,

                        secondary:
                            swatch.dataset.footerSecondary
                    };


                    applyFooterColor(
                        data
                    );


                    showToast(
                        "Footer Updated",
                        `${data.name} is now active.`
                    );

                }
            );

        }
    );


    if (footerCustomizerToggle) {

        footerCustomizerToggle.addEventListener(
            "click",
            () => {

                const open =
                    footerColorPanel.classList.toggle(
                        "open"
                    );


                footerCustomizerToggle.setAttribute(
                    "aria-expanded",
                    open
                );
            }
        );
    }


    loadFooterColor();


    /* =========================================================
       LANGUAGE BUTTONS
    ========================================================== */

    document
        .querySelectorAll(
            "[data-language]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-language]"
                        )
                        .forEach(
                            languageButton => {

                                languageButton.classList.toggle(
                                    "active",
                                    languageButton.dataset.language ===
                                    button.dataset.language
                                );

                            }
                        );


                    const language =
                        button.dataset.language;


                    localStorage.setItem(
                        "schoolLanguage",
                        language
                    );


                    if (language === "FR") {

                        showToast(
                            "French Selected",
                            "The French interface can be connected to your translated content."
                        );

                    } else {

                        showToast(
                            "English Selected",
                            "English interface is active."
                        );
                    }

                }
            );

        });


    const savedLanguage =
        localStorage.getItem(
            "schoolLanguage"
        );


    if (
        savedLanguage === "FR" ||
        savedLanguage === "EN"
    ) {

        document
            .querySelectorAll(
                "[data-language]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.language ===
                    savedLanguage
                );

            });
    }


    /* =========================================================
       VIRTUAL TOUR / ADMISSIONS DESK
    ========================================================== */

    const virtualTour =
        document.querySelector(
            '[data-action="virtual-tour"]'
        );

    if (virtualTour) {

        virtualTour.addEventListener(
            "click",
            () => {

                showToast(
                    "Virtual Tour",
                    "Connect this button to your virtual-tour page when it is ready."
                );

            }
        );
    }


    const admissionsDesk =
        document.querySelector(
            '[data-action="admissions-desk"]'
        );

    if (admissionsDesk) {

        admissionsDesk.addEventListener(
            "click",
            openInquiry
        );
    }


    /* =========================================================
       SOCIAL PLACEHOLDER LINKS
    ========================================================== */

    document
        .querySelectorAll(
            "[data-placeholder-social]"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    showToast(
                        "Social Link",
                        `${link.dataset.placeholderSocial} link has not been configured yet.`
                    );

                }
            );

        });


    /* =========================================================
       POLICY PLACEHOLDERS
    ========================================================== */

    document
        .querySelectorAll(
            "[data-policy]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showToast(
                        button.dataset.policy,
                        "Connect this button to your official policy page."
                    );

                }
            );

        });


    /* =========================================================
       BACK TO TOP
    ========================================================== */

    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* =========================================================
       ESCAPE KEY
    ========================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                if (
                    inquiryModal &&
                    inquiryModal.classList.contains(
                        "modal-open"
                    )
                ) {

                    closeInquiry();

                }


                if (
                    navigationMenu &&
                    navigationMenu.classList.contains(
                        "menu-open"
                    )
                ) {

                    closeMenu();
                }
            }

        }
    );


    /* =========================================================
       MODAL OUTSIDE CLICK
    ========================================================== */

    if (inquiryModal) {

        inquiryModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    inquiryModal
                ) {

                    closeInquiry();

                }

            }
        );
    }


    /* =========================================================
       CURRENT YEAR
    ========================================================== */

    const currentYear =
        document.getElementById(
            "currentYear"
        );

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }/* =========================================================
   RWANDA SCHOOL OF HOSPITALITY
   FAQ PAGE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const html = document.documentElement;
    const body = document.body;

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const menuToggle = document.getElementById("menuToggle");
    const menuIcon = document.getElementById("menuIcon");
    const navigationMenu = document.getElementById("navigationMenu");

    const faqSearch = document.getElementById("faqSearch");
    const faqCategories = document.getElementById("faqCategories");
    const faqContainer = document.getElementById("faqContainer");
    const searchResultsInfo = document.getElementById("searchResultsInfo");
    const faqEmptyState = document.getElementById("faqEmptyState");

    const openInquiry = document.getElementById("openInquiry");
    const closeInquiry = document.getElementById("closeInquiry");
    const inquiryModal = document.getElementById("inquiryModal");
    const inquiryForm = document.getElementById("inquiryForm");
    const inquiryStatus = document.getElementById("inquiryStatus");

    const menuEnquire = document.getElementById("menuEnquire");
    const emptyStateEnquire = document.getElementById("emptyStateEnquire");

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterStatus = document.getElementById("newsletterStatus");

    const footerCustomizerToggle =
        document.getElementById("footerCustomizerToggle");

    const footerColorPanel =
        document.getElementById("footerColorPanel");

    const activeFooterColor =
        document.getElementById("activeFooterColor");

    const footer = document.getElementById("footer");

    const backToTop =
        document.getElementById("backToTop");

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");

    const currentYear =
        document.getElementById("currentYear");


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       TOAST SYSTEM
    ====================================================== */

    let toastTimer = null;

    function showToast(
        title = "Success",
        message = "Done.",
        type = "success"
    ) {

        if (!toast) return;

        if (toastTitle) {
            toastTitle.textContent = title;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        if (toastIcon) {

            if (type === "error") {

                toastIcon.innerHTML =
                    '<i class="fa-solid fa-circle-exclamation"></i>';

                toastIcon.className =
                    "text-red-400 mt-0.5";

            } else {

                toastIcon.innerHTML =
                    '<i class="fa-solid fa-circle-check"></i>';

                toastIcon.className =
                    "text-[#D6B56A] mt-0.5";
            }
        }

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }


    /* =====================================================
       THEME SWITCHER
    ====================================================== */

    function updateThemeIcon() {

        if (!themeIcon) return;

        const isLight =
            html.classList.contains("light-theme");

        if (isLight) {

            themeIcon.className =
                "fa-solid fa-moon text-sm";

        } else {

            themeIcon.className =
                "fa-solid fa-sun text-sm";
        }
    }


    function applySavedTheme() {

        const savedTheme =
            localStorage.getItem("rsh-theme");

        if (savedTheme === "light") {

            html.classList.add("light-theme");

        } else {

            html.classList.remove("light-theme");
        }

        updateThemeIcon();
    }


    applySavedTheme();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            html.classList.toggle("light-theme");

            const isLight =
                html.classList.contains("light-theme");

            localStorage.setItem(
                "rsh-theme",
                isLight ? "light" : "dark"
            );

            updateThemeIcon();

            showToast(
                "Theme Changed",
                isLight
                    ? "Light mode is now active."
                    : "Dark mode is now active."
            );
        });
    }


    /* =====================================================
       NAVIGATION MENU
    ====================================================== */

    function openMenu() {

        if (!navigationMenu) return;

        navigationMenu.classList.add("menu-open");

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );
            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        if (menuIcon) {

            menuIcon.className =
                "fa-solid fa-xmark";
        }
    }


    function closeMenu() {

        if (!navigationMenu) return;

        navigationMenu.classList.remove("menu-open");

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

        if (menuIcon) {

            menuIcon.className =
                "fa-solid fa-bars";
        }
    }


    function toggleMenu() {

        if (!navigationMenu) return;

        if (
            navigationMenu.classList.contains("menu-open")
        ) {

            closeMenu();

        } else {

            openMenu();
        }
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleMenu
        );
    }


    /* Close menu when clicking outside */

    document.addEventListener("click", (event) => {

        if (!navigationMenu || !menuToggle) {
            return;
        }

        const clickedInsideMenu =
            navigationMenu.contains(event.target);

        const clickedMenuButton =
            menuToggle.contains(event.target);

        if (
            !clickedInsideMenu &&
            !clickedMenuButton
        ) {

            closeMenu();
        }
    });


    /* Close menu after clicking menu links */

    document
        .querySelectorAll("[data-menu-link]")
        .forEach(link => {

            link.addEventListener("click", () => {
                closeMenu();
            });
        });


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ====================================================== */

    const mainNavbar =
        document.getElementById("mainNavbar");


    function updateNavbar() {

        if (!mainNavbar) return;

        if (window.scrollY > 25) {

            mainNavbar.classList.add("scrolled");

        } else {

            mainNavbar.classList.remove("scrolled");
        }
    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    updateNavbar();


    /* =====================================================
       FAQ DATA / GROUPS
    ====================================================== */

    const faqGroups = Array.from(
        document.querySelectorAll(".faq-group")
    );

    const faqCategoryButtons = Array.from(
        document.querySelectorAll(".faq-category")
    );


    let activeCategory = "admissions";


    /* =====================================================
       FAQ CATEGORY SWITCHING
    ====================================================== */

    function showCategory(category) {

        activeCategory = category;

        faqCategoryButtons.forEach(button => {

            const buttonCategory =
                button.dataset.category;

            button.classList.toggle(
                "active",
                buttonCategory === category
            );
        });


        faqGroups.forEach(group => {

            const groupCategory =
                group.dataset.group;

            group.classList.toggle(
                "active",
                groupCategory === category
            );
        });


        if (faqSearch) {

            faqSearch.value = "";
        }


        resetAllFAQItems();

        updateSearchInfo(
            getVisibleQuestionCount(),
            getVisibleQuestionCount()
        );


        if (faqEmptyState) {

            faqEmptyState.style.display = "none";
        }
    }


    faqCategoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            if (!category) return;

            showCategory(category);
        });
    });


    /* =====================================================
       FAQ OPEN / CLOSE
    ====================================================== */

    const faqItems =
        Array.from(
            document.querySelectorAll(".faq-item")
        );


    faqItems.forEach(item => {

        item.addEventListener("toggle", () => {

            if (!item.open) return;

            /*
             * Close other FAQ items in the same group.
             */

            const group =
                item.closest(".faq-group");

            if (!group) return;

            group
                .querySelectorAll(".faq-item[open]")
                .forEach(otherItem => {

                    if (otherItem !== item) {
                        otherItem.open = false;
                    }
                });
        });
    });


    function resetAllFAQItems() {

        faqItems.forEach(item => {
            item.open = false;
        });
    }


    /* =====================================================
       FAQ SEARCH
    ====================================================== */

    function getGroupQuestions(group) {

        return Array.from(
            group.querySelectorAll(".faq-item")
        );
    }


    function getQuestionText(item) {

        const question =
            item.querySelector(".faq-question");

        return question
            ? question.textContent
                .trim()
                .toLowerCase()
            : "";
    }


    function getAnswerText(item) {

        const answer =
            item.querySelector(".faq-answer");

        return answer
            ? answer.textContent
                .trim()
                .toLowerCase()
            : "";
    }


    function getVisibleQuestionCount() {

        const activeGroup =
            faqGroups.find(
                group =>
                    group.dataset.group === activeCategory
            );

        if (!activeGroup) return 0;

        return getGroupQuestions(activeGroup).length;
    }


    function updateSearchInfo(found, total) {

        if (!searchResultsInfo) return;

        if (!faqSearch || !faqSearch.value.trim()) {

            const categoryName =
                activeCategory
                    .replace("-", " ")
                    .replace(/\b\w/g, letter =>
                        letter.toUpperCase()
                    );

            searchResultsInfo.textContent =
                `Showing ${categoryName} questions`;

            return;
        }


        if (found === 0) {

            searchResultsInfo.textContent =
                "No matching questions found.";

        } else {

            searchResultsInfo.textContent =
                `Showing ${found} of ${total} matching questions`;
        }
    }


    function searchFAQs() {

        if (!faqSearch) return;

        const searchTerm =
            faqSearch.value
                .trim()
                .toLowerCase();


        const activeGroup =
            faqGroups.find(
                group =>
                    group.dataset.group === activeCategory
            );


        if (!activeGroup) return;


        const items =
            getGroupQuestions(activeGroup);


        /*
         * No search term:
         * show every question.
         */

        if (!searchTerm) {

            items.forEach(item => {

                item.style.display = "";

            });


            if (faqEmptyState) {
                faqEmptyState.style.display = "none";
            }


            updateSearchInfo(
                items.length,
                items.length
            );

            return;
        }


        let found = 0;


        items.forEach(item => {

            const questionText =
                getQuestionText(item);

            const answerText =
                getAnswerText(item);


            const matches =
                questionText.includes(searchTerm) ||
                answerText.includes(searchTerm);


            if (matches) {

                item.style.display = "";

                found++;

            } else {

                item.style.display = "none";

                item.open = false;
            }
        });


        updateSearchInfo(
            found,
            items.length
        );


        if (faqEmptyState) {

            faqEmptyState.style.display =
                found === 0
                    ? "block"
                    : "none";
        }
    }


    if (faqSearch) {

        faqSearch.addEventListener(
            "input",
            searchFAQs
        );
    }


    /* =====================================================
       FAQ SEARCH - ENTER KEY
    ====================================================== */

    if (faqSearch) {

        faqSearch.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter") {
                    return;
                }

                event.preventDefault();

                searchFAQs();
            }
        );
    }


    /* =====================================================
       INQUIRY MODAL
    ====================================================== */

    function openInquiryModal() {

        if (!inquiryModal) return;

        inquiryModal.classList.add("modal-open");

        inquiryModal.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("modal-open");

        setTimeout(() => {

            const nameInput =
                document.getElementById("inquiryName");

            if (nameInput) {
                nameInput.focus();
            }

        }, 150);
    }


    function closeInquiryModal() {

        if (!inquiryModal) return;

        inquiryModal.classList.remove(
            "modal-open"
        );

        inquiryModal.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "modal-open"
        );
    }


    if (openInquiry) {

        openInquiry.addEventListener(
            "click",
            openInquiryModal
        );
    }


    if (closeInquiry) {

        closeInquiry.addEventListener(
            "click",
            closeInquiryModal
        );
    }


    if (menuEnquire) {

        menuEnquire.addEventListener(
            "click",
            () => {

                closeMenu();
                openInquiryModal();
            }
        );
    }


    if (emptyStateEnquire) {

        emptyStateEnquire.addEventListener(
            "click",
            openInquiryModal
        );
    }


    /* Footer enquiry buttons */

    document
        .querySelectorAll("[data-footer-inquiry]")
        .forEach(button => {

            button.addEventListener(
                "click",
                openInquiryModal
            );
        });


    /* =====================================================
       CLOSE MODAL BY BACKDROP
    ====================================================== */

    if (inquiryModal) {

        inquiryModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === inquiryModal
                ) {

                    closeInquiryModal();
                }
            }
        );
    }


    /* =====================================================
       CLOSE MODAL WITH ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                inquiryModal &&
                inquiryModal.classList.contains(
                    "modal-open"
                )
            ) {

                closeInquiryModal();

                return;
            }


            if (
                navigationMenu &&
                navigationMenu.classList.contains(
                    "menu-open"
                )
            ) {

                closeMenu();
            }
        }
    );


    /* =====================================================
       INQUIRY FORM
    ====================================================== */

    if (inquiryForm) {

        inquiryForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "inquiryName"
                    );

                const emailInput =
                    document.getElementById(
                        "inquiryEmail"
                    );

                const questionInput =
                    document.getElementById(
                        "inquiryQuestion"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const question =
                    questionInput
                        ? questionInput.value.trim()
                        : "";


                if (
                    !name ||
                    !email ||
                    !question
                ) {

                    showFormStatus(
                        inquiryStatus,
                        "Please complete all required fields.",
                        "error"
                    );

                    return;
                }


                /*
                 * Browser email validation.
                 */

                if (
                    emailInput &&
                    !emailInput.checkValidity()
                ) {

                    showFormStatus(
                        inquiryStatus,
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                const enquiry = {

                    id:
                        Date.now(),

                    name:
                        name,

                    email:
                        email,

                    question:
                        question,

                    date:
                        new Date().toISOString()
                };


                const existingEnquiries =
                    JSON.parse(
                        localStorage.getItem(
                            "rsh-enquiries"
                        )
                    ) || [];


                existingEnquiries.push(
                    enquiry
                );


                localStorage.setItem(
                    "rsh-enquiries",
                    JSON.stringify(
                        existingEnquiries
                    )
                );


                showFormStatus(
                    inquiryStatus,
                    "Your enquiry has been saved successfully.",
                    "success"
                );


                inquiryForm.reset();


                showToast(
                    "Enquiry Saved",
                    "Your question has been saved locally."
                );


                setTimeout(() => {

                    closeInquiryModal();

                }, 1800);
            }
        );
    }


    /* =====================================================
       FORM STATUS HELPER
    ====================================================== */

    function showFormStatus(
        element,
        message,
        type
    ) {

        if (!element) return;

        element.textContent = message;

        element.className =
            "status-message show " +
            (
                type === "error"
                    ? "status-error"
                    : "status-success"
            );
    }


    /* =====================================================
       NEWSLETTER
    ====================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!newsletterEmail) {
                    return;
                }


                const email =
                    newsletterEmail.value.trim();


                if (!email) {

                    showFormStatus(
                        newsletterStatus,
                        "Please enter your email address.",
                        "error"
                    );

                    return;
                }


                if (
                    !newsletterEmail.checkValidity()
                ) {

                    showFormStatus(
                        newsletterStatus,
                        "Please enter a valid email address.",
                        "error"
                    );

                    newsletterEmail.focus();

                    return;
                }


                const subscribers =
                    JSON.parse(
                        localStorage.getItem(
                            "rsh-newsletter"
                        )
                    ) || [];


                if (
                    subscribers.includes(email)
                ) {

                    showFormStatus(
                        newsletterStatus,
                        "This email is already subscribed.",
                        "error"
                    );

                    return;
                }


                subscribers.push(email);


                localStorage.setItem(
                    "rsh-newsletter",
                    JSON.stringify(
                        subscribers
                    )
                );


                showFormStatus(
                    newsletterStatus,
                    "Thank you! You are now subscribed to school updates.",
                    "success"
                );


                newsletterForm.reset();


                showToast(
                    "Subscription Successful",
                    "You will receive future school updates."
                );
            }
        );
    }


    /* =====================================================
       FOOTER COLOR CUSTOMIZER
    ====================================================== */

    const footerSwatches =
        Array.from(
            document.querySelectorAll(
                ".footer-color-swatch"
            )
        );


    function applyFooterColor(
        primary,
        secondary,
        name,
        save = true
    ) {

        if (!footer) return;


        footer.style.setProperty(
            "--footer-primary",
            primary
        );

        footer.style.setProperty(
            "--footer-secondary",
            secondary
        );


        if (activeFooterColor) {

            activeFooterColor.textContent =
                name;
        }


        footerSwatches.forEach(swatch => {

            const swatchName =
                swatch.dataset.footerName;

            swatch.classList.toggle(
                "active",
                swatchName === name
            );
        });


        if (save) {

            localStorage.setItem(
                "rsh-footer-color",
                JSON.stringify({
                    name,
                    primary,
                    secondary
                })
            );
        }
    }


    function loadFooterColor() {

        const saved =
            localStorage.getItem(
                "rsh-footer-color"
            );


        if (!saved) return;


        try {

            const color =
                JSON.parse(saved);


            if (
                color &&
                color.primary &&
                color.secondary &&
                color.name
            ) {

                applyFooterColor(
                    color.primary,
                    color.secondary,
                    color.name,
                    false
                );
            }

        } catch (error) {

            console.warn(
                "Could not load saved footer color.",
                error
            );
        }
    }


    if (footerCustomizerToggle) {

        footerCustomizerToggle.addEventListener(
            "click",
            () => {

                if (!footerColorPanel) {
                    return;
                }


                const isOpen =
                    footerColorPanel.classList.toggle(
                        "open"
                    );


                footerCustomizerToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );
    }


    footerSwatches.forEach(swatch => {

        swatch.addEventListener(
            "click",
            () => {

                const name =
                    swatch.dataset.footerName;

                const primary =
                    swatch.dataset.footerPrimary;

                const secondary =
                    swatch.dataset.footerSecondary;


                if (
                    !name ||
                    !primary ||
                    !secondary
                ) {
                    return;
                }


                applyFooterColor(
                    primary,
                    secondary,
                    name
                );


                showToast(
                    "Footer Updated",
                    `${name} footer color is now active.`
                );
            }
        );
    });


    loadFooterColor();


    /* =====================================================
       SOCIAL PLACEHOLDER LINKS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-placeholder-social]"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const platform =
                        link.dataset.placeholderSocial ||
                        "Social media";


                    showToast(
                        `${platform} Link`,
                        `Add the official ${platform} URL here.`,
                        "error"
                    );
                }
            );
        });


    /* =====================================================
       POLICY BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-policy]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const policy =
                        button.dataset.policy;


                    showToast(
                        policy,
                        `${policy} page can be connected here.`
                    );
                }
            );
        });


    /* =====================================================
       ANNOUNCEMENT BAR ACTIONS
    ====================================================== */

    document
        .querySelectorAll(
            '[data-action="virtual-tour"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showToast(
                        "Virtual Tour",
                        "Connect this button to your virtual tour page."
                    );
                }
            );
        });


    document
        .querySelectorAll(
            '[data-action="admissions-desk"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                openInquiryModal
            );
        });


    /* =====================================================
       LANGUAGE BUTTONS
    ====================================================== */

    const languageButtons =
        document.querySelectorAll(
            "[data-language]"
        );


    languageButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const language =
                    button.dataset.language;


                languageButtons.forEach(
                    languageButton => {

                        languageButton.classList.toggle(
                            "active",
                            languageButton.dataset.language ===
                                language
                        );
                    }
                );


                if (language === "EN") {

                    showToast(
                        "Language",
                        "English is currently selected."
                    );

                } else if (language === "FR") {

                    showToast(
                        "Language",
                        "French interface selected. Translation content can be connected here."
                    );
                }
            }
        );
    });


    /* =====================================================
       BACK TO TOP
    ====================================================== */

    function updateBackToTop() {

        if (!backToTop) return;


        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");
        }
    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* =====================================================
       SMOOTH SCROLL FOR INTERNAL LINKS
    ====================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                    closeMenu();
                }
            );
        });


    /* =====================================================
       LUCIDE ICONS
    ====================================================== */

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons();
    }


    /* =====================================================
       INITIAL FAQ STATE
    ====================================================== */

    showCategory("admissions");


    /* =====================================================
       INITIAL MESSAGE
    ====================================================== */

    console.log(
        "Rwanda School of Hospitality FAQ JavaScript loaded successfully."
    );

});


    /* =========================================================
       LUCIDE
    ========================================================== */

    if (
        typeof lucide !== "undefined"
    ) {

        lucide.createIcons();

    }

});