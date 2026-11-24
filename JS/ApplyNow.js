/* =========================================================
   NOAH'S ARK INTERNATIONAL SCHOOL
   APPLY NOW — THEME & MOBILE NAVIGATION

   FEATURES
   01. Persistent Dark / Light Theme
   02. Theme Toggle Icons
   03. Responsive Mobile Navigation
   04. Outside Click Handling
   05. Escape Key Handling

   THEME CLASS: html.light-mode
   STORAGE KEY: rsh-theme
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       01. DARK / LIGHT THEME
    ===================================================== */

    const root = document.documentElement;

    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");

    const THEME_STORAGE_KEY = "rsh-theme";

    // Apply the selected theme.
    function applyTheme(theme, savePreference = true) {
        const isLight = theme === "light";

        // Your ApplyNow.css uses html.light-mode.
        root.classList.toggle("light-mode", isLight);

        // Update theme icons.
        if (sunIcon) {
            sunIcon.classList.toggle("hidden", isLight);
        }

        if (moonIcon) {
            moonIcon.classList.toggle("hidden", !isLight);
        }

        // Update accessibility attributes.
        if (themeToggle) {
            const label = isLight
                ? "Switch to dark mode"
                : "Switch to light mode";

            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
            themeToggle.setAttribute("aria-pressed", String(isLight));
        }

        // Save the selected theme.
        if (savePreference) {
            try {
                localStorage.setItem(
                    THEME_STORAGE_KEY,
                    isLight ? "light" : "dark"
                );
            } catch (error) {
                console.warn("Could not save theme preference:", error);
            }
        }
    }

    // Restore the previously saved theme.
    function restoreTheme() {
        let savedTheme = "dark";

        try {
            savedTheme =
                localStorage.getItem(THEME_STORAGE_KEY) || "dark";
        } catch (error) {
            console.warn("Could not read saved theme:", error);
        }

        applyTheme(
            savedTheme === "light" ? "light" : "dark",
            false
        );
    }

    // Restore theme when the page loads.
    restoreTheme();

    // Theme toggle click event.
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentlyLight =
                root.classList.contains("light-mode");

            applyTheme(currentlyLight ? "dark" : "light");
        });
    }


    /* =====================================================
       02. RESPONSIVE MOBILE NAVIGATION
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const menuPanel = document.getElementById("menuPanel");

    if (!menuButton || !menuPanel) {
        return;
    }

    const menuLines =
        menuButton.querySelectorAll(".menu-line");

    const menuLinks =
        menuPanel.querySelectorAll("a");


    /* =====================================================
       03. OPEN & CLOSE MOBILE MENU
    ===================================================== */

    function setMenu(open) {

        // Show or hide the navigation panel.
        menuPanel.classList.toggle("menu-open", open);

        // Accessibility attributes.
        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuButton.setAttribute(
            "aria-label",
            open
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        // Animate hamburger icon into an X.
        if (menuLines.length >= 3) {

            menuLines[0].style.transform = open
                ? "translateY(5px) rotate(45deg)"
                : "";

            menuLines[1].style.opacity = open ? "0" : "1";

            menuLines[2].style.transform = open
                ? "translateY(-5px) rotate(-45deg)"
                : "";
        }
    }


    /* =====================================================
       04. MENU BUTTON CLICK
    ===================================================== */

    menuButton.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        setMenu(!isOpen);
    });


    /* =====================================================
       05. CLOSE MENU AFTER SELECTING A LINK
    ===================================================== */

    menuLinks.forEach((link) => {

        link.addEventListener("click", () => {
            setMenu(false);
        });

    });


    /* =====================================================
       06. CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", (event) => {

        const clickedButton =
            menuButton.contains(event.target);

        const clickedPanel =
            menuPanel.contains(event.target);

        if (!clickedButton && !clickedPanel) {
            setMenu(false);
        }

    });


    /* =====================================================
       07. CLOSE MENU WITH ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            setMenu(false);
        }

    });


    /* =====================================================
       08. INITIAL MENU STATE
    ===================================================== */

    setMenu(false);

});

/* =========================================================
   09. PAYMENT METHOD & PAYMENT STATUS
========================================================= */

const paymentStatus = document.getElementById("paymentStatus");
const paymentDetails = document.getElementById("paymentDetails");

const transactionReference = document.getElementById("transactionReference");
const paymentDate = document.getElementById("paymentDate");
const paymentProof = document.getElementById("paymentProof");


function updatePaymentDetails() {

    if (!paymentStatus || !paymentDetails) return;

    const hasPaid = paymentStatus.value === "paid";

    // Show payment details only when the applicant has paid.
    paymentDetails.hidden = !hasPaid;

    // Enable or disable the payment fields.
    [transactionReference, paymentDate, paymentProof].forEach((field) => {

        if (!field) return;

        field.disabled = !hasPaid;

        field.required = hasPaid;

        if (!hasPaid) {
            field.value = "";
        }

    });

}


// Listen for payment status changes.
if (paymentStatus) {

    paymentStatus.addEventListener("change", updatePaymentDetails);

    // Set the correct initial state.
    updatePaymentDetails();

}

/* =========================================================
   10. LOAD PROGRAMMES FROM THE BACKEND API
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const programmeSelect = document.getElementById("program");

    if (!programmeSelect) return;

    try {

  const response = await fetch(
    "http://localhost:5000/api/programmes",
    {
        method: "GET",
        cache: "no-store",
        headers: {
            "Accept": "application/json"
        }
    }
);

        if (!response.ok) {
            throw new Error("Failed to retrieve programmes.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.programmes)) {
            throw new Error("Invalid programmes response.");
        }

        // Clear the loading message.
        programmeSelect.innerHTML =
            '<option value="">Choose a programme</option>';

        // Create one option for each active programme.
        data.programmes.forEach((programme) => {

            const option = document.createElement("option");

            option.value = programme.id;

            option.textContent = programme.programme_name;

            programmeSelect.appendChild(option);

        });

    } catch (error) {

        console.error("Programme loading error:", error);

        programmeSelect.innerHTML =
            '<option value="">Unable to load programmes. Please refresh.</option>';

    }

});

/* =========================================================
   11. O-LEVEL ELIGIBILITY HANDLING
========================================================= */

const applicationForm = document.getElementById("applicationForm");

const oLevelCompleted = document.getElementById("oLevelCompleted");
const oLevelDetails = document.getElementById("oLevelDetails");
const oLevelEligibilityMessage = document.getElementById("oLevelEligibilityMessage");

const oLevelSchool = document.getElementById("oLevelSchool");
const oLevelYear = document.getElementById("oLevelYear");
const oLevelIndex = document.getElementById("oLevelIndex");
const oLevelResults = document.getElementById("oLevelResults");

function updateOLevelDetails() {

    if (!oLevelCompleted || !oLevelDetails) return;

    const eligible = oLevelCompleted.value === "yes";

    oLevelDetails.hidden = !eligible;

    [oLevelSchool, oLevelYear, oLevelIndex, oLevelResults]
        .forEach((field) => {

            if (!field) return;

            field.disabled = !eligible;

            field.required =
                eligible && field.id !== "oLevelIndex";

            if (!eligible) {
                field.value = "";
            }

        });

    if (oLevelEligibilityMessage) {

        if (eligible) {
            oLevelEligibilityMessage.textContent =
                "You meet the O-Level eligibility requirement. Please provide your qualification details.";

        } else if (oLevelCompleted.value === "no") {
            oLevelEligibilityMessage.textContent =
                "You must complete O-Level before applying for Advanced Level.";

        } else {
            oLevelEligibilityMessage.textContent =
                "Select your current O-Level status to continue.";
        }
    }
}

if (oLevelCompleted) {

    oLevelCompleted.addEventListener(
        "change",
        updateOLevelDetails
    );

    updateOLevelDetails();
}


/* =========================================================
   12. FORM SUBMISSION TO THE BACKEND
========================================================= */

if (applicationForm) {

    applicationForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        console.log("APPLICATION SUBMISSION HANDLER STARTED");

        const formMessage =
            document.getElementById("formMessage");

        const submitButton =
            applicationForm.querySelector('button[type="submit"]');

        // -------------------------------------------------
        // A. DISPLAY FORM MESSAGES
        // -------------------------------------------------

        function showMessage(message, success = false) {

            if (!formMessage) return;

            formMessage.textContent = message;

            formMessage.classList.remove("hidden");

            formMessage.classList.remove(
                "border-red-500/40",
                "bg-red-500/10",
                "text-red-300",
                "border-green-500/40",
                "bg-green-500/10",
                "text-green-300"
            );

            formMessage.classList.add(
                "border",
                "rounded-xl",
                "p-4"
            );

            if (success) {

                formMessage.classList.add(
                    "border-green-500/40",
                    "bg-green-500/10",
                    "text-green-300"
                );

            } else {

                formMessage.classList.add(
                    "border-red-500/40",
                    "bg-red-500/10",
                    "text-red-300"
                );

            }
        }

        // -------------------------------------------------
        // B. CHECK O-LEVEL ELIGIBILITY
        // -------------------------------------------------

        if (oLevelCompleted?.value !== "yes") {

            showMessage(
                "You must complete O-Level before applying."
            );

            oLevelCompleted?.focus();

            return;
        }

        // -------------------------------------------------
        // C. PREVENT MULTIPLE SUBMISSIONS
        // -------------------------------------------------

        if (submitButton.disabled) return;

        const originalButtonText =
            submitButton.textContent;

        submitButton.disabled = true;

        submitButton.textContent = "Submitting Application...";

        // -------------------------------------------------
        // D. COLLECT FORM DATA
        // -------------------------------------------------

        const formData = new FormData(applicationForm);

        try {

            // -------------------------------------------------
            // E. SEND APPLICATION TO EXPRESS BACKEND
            // -------------------------------------------------

const response = await fetch("http://localhost:5000/api/applications", {
    method: "POST",
    body: formData
});

            const data = await response.json();

            // -------------------------------------------------
            // F. HANDLE BACKEND ERRORS
            // -------------------------------------------------

            if (!response.ok || !data.success) {

                showMessage(
                    data.message ||
                    "Unable to submit your application. Please try again."
                );

                return;
            }

            // -------------------------------------------------
            // G. HANDLE SUCCESSFUL SUBMISSION
            // -------------------------------------------------

            showMessage(
                `${data.message} Application ID: ${data.application.id}`,
                true
            );

            // Clear the form after successful submission.
            applicationForm.reset();

            // Restore the correct initial field states.
            updateOLevelDetails();
            updatePaymentDetails();

        } catch (error) {

            console.error(
                "APPLICATION SUBMISSION ERROR:",
                error
            );

            showMessage(
                "Unable to connect to the admissions server. Please check your connection and try again."
            );

        } finally {

            // -------------------------------------------------
            // H. RESTORE SUBMIT BUTTON
            // -------------------------------------------------

            submitButton.disabled = false;

            submitButton.textContent = originalButtonText;

        }

    });

}
