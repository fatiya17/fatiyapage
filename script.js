document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle Functionality ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // --- 2. Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 3. Glitter Cursor Effect ---
    if (window.matchMedia('(min-width: 768px)').matches) { // Hanya aktif di desktop
        const glitterColors = ['#b599d0', '#FFCACC', '#D4E2D4', '#ffffff'];
        let throttleTimeout;

        const createParticle = (x, y) => {
            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            document.body.appendChild(particle);

            const size = Math.random() * 10 + 4 + 2 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = glitterColors[Math.floor(Math.random() * glitterColors.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            const destinationX = (Math.random() - 0.5) * 200;
            const destinationY = (Math.random() - 0.5) * 200;

            particle.style.setProperty('--x-end', `${destinationX}px`);
            particle.style.setProperty('--y-end', `${destinationY}px`);

            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        };

        document.addEventListener('mousemove', (e) => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    createParticle(e.clientX, e.clientY);
                    throttleTimeout = null;
                }, 10);
            }
        });
    }


    // --- 4. Contact Form Functionality ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        
        const EMAILJS_SERVICE_ID = 'service_fatiyaAPI';
        const EMAILJS_TEMPLATE_ID = 'template_fatiyaAPI';
        const EMAILJS_PUBLIC_KEY = 'UqwnmlVw39j50jK_K';
        
        const submitButton = contactForm.querySelector('button[type="submit"]');

        const showNotification = (message, type = 'success') => {
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close">&times;</button>`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            
            const closeNotif = () => {
                notification.classList.remove('show');
                notification.addEventListener('transitionend', () => notification.remove());
            };
            
            setTimeout(closeNotif, 5000);
            notification.querySelector('.notification-close').addEventListener('click', closeNotif);
        };

        const setButtonLoading = (isLoading) => {
            if (isLoading) {
                submitButton.disabled = true;
                submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>`;
                submitButton.classList.add('loading');
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = `<i class="fas fa-paper-plane"></i><span>Send Message</span>`;
                submitButton.classList.remove('loading');
            }
        };

// GANTI BLOK FUNGSI EVENT LISTENER INI DI script.js ANDA

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    setButtonLoading(true);

    // KITA GUNAKAN NAMA VARIABEL BARU YANG UNIK
    const templateParams = {
        contact_name: document.getElementById('name').value,
        contact_email: document.getElementById('email').value,
        contact_subject: document.getElementById('subject').value,
        contact_message: document.getElementById('message').value,
    };
    
    // Menggunakan emailjs.send() yang lebih eksplisit
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        }, (error) => {
            console.log('FAILED...', error);
            showNotification('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            setButtonLoading(false);
        });
        });
    }
// --- 5. Project Slider ---
    const sliderContainer = document.querySelector('.project-slider-container');
    if (sliderContainer) {
        const track = document.querySelector('.project-slider-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.slider-dots');

        if (slides.length > 0) {
            let slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 0;
            let autoplayInterval;
            const AUTOPLAY_DELAY = 5000;

            const moveToSlide = (targetIndex) => {
                if (!track.children[targetIndex]) return;
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
                
                const currentDot = dotsNav.querySelector('.active');
                if (currentDot) currentDot.classList.remove('active');
                dotsNav.children[targetIndex].classList.add('active');

                currentIndex = targetIndex;
            };

            const startAutoplay = () => {
                clearInterval(autoplayInterval);
                autoplayInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                }, AUTOPLAY_DELAY);
            };
            
            const initSlider = () => {
                slideWidth = slides[0].getBoundingClientRect().width;
                dotsNav.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('slider-dot');
                    dot.addEventListener('click', () => { moveToSlide(index); startAutoplay(); });
                    dotsNav.appendChild(dot);
                });
                moveToSlide(0);
                startAutoplay();
            };
            
            nextButton.addEventListener('click', () => { moveToSlide((currentIndex + 1) % slides.length); startAutoplay(); });
            prevButton.addEventListener('click', () => { moveToSlide((currentIndex - 1 + slides.length) % slides.length); startAutoplay(); });
            
            window.addEventListener('resize', () => {
                track.style.transition = 'none';
                initSlider();
            });
            
            initSlider();
        }
    }

     // --- 6. Hero Section Typing Animation ---
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        const typingSpeed = 100; // Kecepatan mengetik dalam milidetik

        const typeWriter = (element, text) => {
            let i = 0;
            element.innerHTML = ''; // Kosongkan teks awal
            element.classList.add('typing-effect'); // Tambahkan kelas untuk efek kursor

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, typingSpeed);
                } else {
                    // Setelah selesai, hapus kursor yang berkedip setelah 1.5 detik
                    setTimeout(() => {
                        element.classList.remove('typing-effect');
                    }, 1500);
                }
            }
            type();
        };

        // Mulai animasi setelah halaman dimuat sejenak
        setTimeout(() => {
            typeWriter(heroTitle, originalText);
        }, 500); // Jeda 0.5 detik sebelum mulai
    }
}); // --- AKHIR DARI DOMContentLoaded ---