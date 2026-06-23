/**
 * Nia Syahfitri - Portfolio Website JavaScript
 * Interactive navbar, scroll spy, scroll reveals, cert lightbox, and validated form feedback.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAV TOGGLE (MOBILE) & SCROLL NAVBAR EFFECT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const navMenu = document.getElementById('navMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Add box-shadow & dark background to navbar on scroll
    const checkScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    /* ==========================================================================
       2. SCROLL SPY (SYNC NAV ACTIVE LINKS)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const scrollSpy = () => {
        const top = window.scrollY + 120;
        
        sections.forEach(sec => {
            const offset = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            
            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       3. INTERSECTION OBSERVER (SCROLL REVEALS & SKILL PROGRESS BARS)
       ========================================================================== */
    const revealSections = document.querySelectorAll('.reveal-section');
    const progressBars = document.querySelectorAll('.progress-bar');

    // Section reveal observer
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Skills progress bar observer
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-progress');
                bar.style.width = targetWidth;
                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.1
    });

    progressBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    /* ==========================================================================
       4. CERTIFICATE LIGHTBOX PREVIEW
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const certCards = document.querySelectorAll('.cert-card');

    // Open lightbox
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.cert-image');
            const title = card.querySelector('.cert-title').innerText;
            const issuer = card.querySelector('.cert-issuer').innerText;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.innerHTML = `${title} <br><span style="font-size: 0.8rem; font-weight: 400; opacity: 0.8;">${issuer}</span>`;

            lightboxModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Stop page scrolling
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightboxModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Resume page scrolling
    };

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightbox();
        }
    });

    /* ==========================================================================
       5. CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const btnSubmit = contactForm.querySelector('.btn-submit');
    const toast = document.getElementById('toastNotification');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('formName').value;
        const emailVal = document.getElementById('formEmail').value;
        const messageVal = document.getElementById('formMessage').value;

        // Animate Button state to Loading
        const originalBtnContent = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
            <span>Mengirim...</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;

        // Submit form using FormSubmit AJAX endpoint
        fetch("https://formsubmit.co/ajax/niaasyahfitri@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                message: messageVal
            })
        })
        .then(response => response.json())
        .then(data => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnContent;

            // FormSubmit returns success: "true" as a string or boolean
            if (data.success === "true" || data.success === true) {
                // Trigger success toast feedback
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);

                // Clear input fields
                contactForm.reset();
            } else if (data.message && data.message.includes("Activation")) {
                // Custom friendly alert for first-time activation
                alert("Langkah Terakhir: Aktivasi Email Anda!\n\nFormSubmit telah mengirimkan email verifikasi ke niaasyahfitri@gmail.com.\n\nSilakan buka inbox email Anda (atau folder Spam/Promosi) dan klik link 'Activate Form' agar formulir kontak ini aktif dan bisa mengirim pesan.");
                contactForm.reset();
            } else {
                alert("Gagal mengirim pesan: " + (data.message || "Silakan coba lagi."));
            }
        })
        .catch(error => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnContent;
            console.error('Error:', error);
            alert("Terjadi kesalahan jaringan. Pastikan Anda terhubung ke internet dan coba lagi.");
        });
    });

    /* ==========================================================================
       6. SLIDER CAROUSEL MODULE
       ========================================================================== */
    const initSlider = (containerId, controlsId, itemsPerView) => {
        const container = document.getElementById(containerId);
        const controls = document.getElementById(controlsId);
        if (!container || !controls) return;

        const track = container.querySelector('.slider-track');
        const prevBtn = controls.querySelector('.prev-btn');
        const nextBtn = controls.querySelector('.next-btn');
        const cards = track.children;
        if (cards.length === 0) return;

        let currentIndex = 0;

        const updateSlider = () => {
            let currentItemsPerView = itemsPerView.desktop;
            if (window.innerWidth <= 575) {
                currentItemsPerView = itemsPerView.mobile;
            } else if (window.innerWidth <= 991) {
                currentItemsPerView = itemsPerView.tablet || itemsPerView.desktop;
            }

            const maxIndex = Math.max(0, cards.length - currentItemsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            const cardWidth = cards[0].offsetWidth;
            const style = window.getComputedStyle(cards[0]);
            const marginRight = parseFloat(style.marginRight) || 0;
            
            const offset = currentIndex * (cardWidth + marginRight);
            track.style.transform = `translateX(-${offset}px)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;

            if (cards.length <= currentItemsPerView) {
                controls.style.display = 'none';
            } else {
                controls.style.display = 'flex';
            }
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            let currentItemsPerView = itemsPerView.desktop;
            if (window.innerWidth <= 575) {
                currentItemsPerView = itemsPerView.mobile;
            } else if (window.innerWidth <= 991) {
                currentItemsPerView = itemsPerView.tablet || itemsPerView.desktop;
            }
            const maxIndex = cards.length - currentItemsPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        updateSlider();
        window.addEventListener('resize', updateSlider);
    };

    // Initialize carousels
    initSlider('projects-slider-container', 'projects-slider-controls', { desktop: 4, tablet: 2, mobile: 1 });
    initSlider('certs-slider-container', 'certs-slider-controls', { desktop: 2, tablet: 2, mobile: 1 });

});
