document.addEventListener("DOMContentLoaded", () => {
    // --- THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;
    
    // Safety check for theme toggle
    if (themeToggle) {
        const icon = themeToggle.querySelector("i");
        
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
            if (icon) {
                if (theme === "dark") {
                    icon.className = "fas fa-sun";
                } else {
                    icon.className = "fas fa-moon";
                }
            }
        }

        themeToggle.addEventListener("click", () => {
            let current = htmlElement.getAttribute("data-theme");
            let newTheme = current === "light" ? "dark" : "light";
            
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateIcon(newTheme);
        });
    }

    // --- NAVIGATION LOGIC ---
    const navToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            navToggle.setAttribute("aria-expanded", isOpen);
            const icon = navToggle.querySelector("i");
            if (icon) {
                icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
                const icon = navToggle.querySelector("i");
                if (icon) {
                    icon.className = "fas fa-bars";
                }
            }
        });
    });

    // Close mobile menu on outside click
    document.addEventListener("click", (e) => {
        if (navMenu && navMenu.classList.contains("active") && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            const icon = navToggle.querySelector("i");
            if (icon) {
                icon.className = "fas fa-bars";
            }
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            const icon = navToggle.querySelector("i");
            if (icon) {
                icon.className = "fas fa-bars";
            }
        }
    });

    // --- CONTACT FORM LOGIC (FormSubmit Integration) ---
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
            const responseMsg = document.getElementById("responseMessage");
            responseMsg.className = "hidden";
            
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const btn = document.getElementById("submitBtn");
            const spinner = document.getElementById("spinner");
            const btnText = document.getElementById("buttonText");
            
            // Enhanced validation
            let isValid = true;
            
            // Name validation
            if (!name) { 
                document.getElementById("nameError").textContent = "Name is required."; 
                isValid = false; 
            } else if (name.length < 2) {
                document.getElementById("nameError").textContent = "Name must be at least 2 characters."; 
                isValid = false; 
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) { 
                document.getElementById("emailError").textContent = "Email is required."; 
                isValid = false; 
            } else if (!emailRegex.test(email)) { 
                document.getElementById("emailError").textContent = "Please enter a valid email address."; 
                isValid = false; 
            }
            
            // Message validation
            if (!message) { 
                document.getElementById("messageError").textContent = "Message is required."; 
                isValid = false; 
            } else if (message.length < 10) {
                document.getElementById("messageError").textContent = "Message must be at least 10 characters."; 
                isValid = false; 
            }

            if (!isValid) return;

            // Show loading state
            btn.disabled = true;
            spinner.classList.remove("hidden");
            btnText.textContent = "Sending...";

            try {
                // FormSubmit AJAX endpoint with your Gmail
                const response = await fetch("https://formsubmit.co/ajax/bistadinesh642@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: "New Portfolio Contact Message",
                        _template: "table",
                        _captcha: "false" // Change to "true" for production
                    })
                });

                const result = await response.json();
                
                if (response.ok && result.success === "true") {
                    responseMsg.textContent = "Message sent successfully! I'll get back to you soon.";
                    responseMsg.className = "success";
                    form.reset();
                } else {
                    let errorMsg = "Something went wrong. Please try again.";
                    if (result.message) {
                        errorMsg = result.message;
                    } else if (result.error) {
                        errorMsg = result.error;
                    }
                    responseMsg.textContent = errorMsg;
                    responseMsg.className = "error";
                }

            } catch (error) {
                console.error("Form submission error:", error);
                responseMsg.textContent = "Network error. Please try again or email me directly at bistadinesh642@gmail.com";
                responseMsg.className = "error";
            } finally {
                // Reset button state
                btn.disabled = false;
                spinner.classList.add("hidden");
                btnText.textContent = "Send Message";
                
                // Clear any existing timeout
                if (window.responseTimeout) {
                    clearTimeout(window.responseTimeout);
                }
                
                // Auto-hide message after 6 seconds
                window.responseTimeout = setTimeout(() => {
                    if (responseMsg.className !== "hidden") {
                        responseMsg.className = "hidden";
                    }
                }, 6000);
            }
        });
    }

    // --- SMOOTH SCROLL FOR NAVIGATION LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                const currentId = section.getAttribute('id');
                
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Only add scroll listener if we have sections and nav links
    if (sections.length > 0 && navLinkItems.length > 0) {
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // Call once on load
    }

    // =========================================================
    // VISITOR COUNTER (CounterAPI v2) - NO SIGNUP REQUIRED
    // Updated to fix the deprecated v1 error.
    // =========================================================
    const counterElement = document.getElementById("count-number");
    if (counterElement) {
        // Fetch real visit count using the updated CounterAPI v2 endpoint
        fetch("https://api.counterapi.dev/api/v2/visit/bistadinesh/portfolio/")
            .then(response => response.json())
            .then(data => {
                // Update the number in the footer with comma formatting (e.g., 1,284)
                if (data && data.count) {
                    counterElement.textContent = data.count.toLocaleString(); 
                }
            })
            .catch(error => {
                // If the API fails, it simply stays at 0. Nothing breaks.
                console.warn("Visitor counter issue:", error);
            });
    }
});
