document.addEventListener("DOMContentLoaded", () => {
    // --- THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById("theme-toggle");
    const icon = themeToggle.querySelector("i");
    const htmlElement = document.documentElement;
    
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
        htmlElement.setAttribute("data-theme", currentTheme);
        updateIcon(currentTheme);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const systemTheme = prefersDark ? "dark" : "light";
        htmlElement.setAttribute("data-theme", systemTheme);
        updateIcon(systemTheme);
    }

    function updateIcon(theme) {
        if (theme === "dark") {
            icon.className = "fas fa-sun";
        } else {
            icon.className = "fas fa-moon";
        }
    }

    themeToggle.addEventListener("click", () => {
        let current = htmlElement.getAttribute("data-theme");
        let newTheme = current === "light" ? "dark" : "light";
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateIcon(newTheme);
    });

    // --- NAVIGATION LOGIC ---
    const navToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            navToggle.setAttribute("aria-expanded", isOpen);
            const icon = navToggle.querySelector("i");
            icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.querySelector("i").className = "fas fa-bars";
            }
        });
    });

    // --- CONTACT FORM LOGIC ---
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
            const responseMsg = document.getElementById("responseMessage");
            responseMsg.className = "hidden";
            
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const btn = document.getElementById("submitBtn");
            const spinner = document.getElementById("spinner");
            const btnText = document.getElementById("buttonText");
            
            let isValid = true;
            if (!name) { document.getElementById("nameError").textContent = "Name is required."; isValid = false; }
            if (!email || !email.includes("@")) { document.getElementById("emailError").textContent = "Valid email is required."; isValid = false; }
            if (!message) { document.getElementById("messageError").textContent = "Message is required."; isValid = false; }

            if (!isValid) return;

            btn.disabled = true;
            spinner.classList.remove("hidden");
            btnText.textContent = "Sending...";

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const response = await fetch(form.action, {
                    method: "POST",
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    responseMsg.textContent = "Message sent successfully. I'll get back to you soon.";
                    responseMsg.className = "success";
                    form.reset();
                } else {
                    let errorMsg = "Something went wrong. Please try again.";
                    try {
                        const result = await response.json();
                        if(result.message) errorMsg = result.message;
                    } catch (e) {}
                    responseMsg.textContent = errorMsg;
                    responseMsg.className = "error";
                }

            } catch (error) {
                responseMsg.textContent = "Network error. Please try again.";
                responseMsg.className = "error";
            } finally {
                btn.disabled = false;
                spinner.classList.add("hidden");
                btnText.textContent = "Send Message";
                
                setTimeout(() => {
                    if (responseMsg.className !== "hidden") responseMsg.className = "hidden";
                }, 6000);
            }
        });
    }
});