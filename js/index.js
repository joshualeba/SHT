$(document).ready(function () {
    // ===== Navegación personalizada (sin bootstrap) =====
    const navbar = document.querySelector('.custom-navbar');
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu-overlay');
    const body = document.body;

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            body.classList.toggle('nav-active');
        });
    }

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (hamburger) hamburger.classList.remove('active');
            body.classList.remove('nav-active');

            // Smooth scroll for internal links
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    const offset = 70;
                    const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, ' ');
                }
            }
        });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (body.classList.contains('nav-active') && !e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            body.classList.remove('nav-active');
        }
    });

    // Limpiar clases si se cambia el tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            body.classList.remove('nav-active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });

    var scrollPosition = 0;
    var swiperInstances = {};

    $('.modal').on('show.bs.modal', function () {
        scrollPosition = $(window).scrollTop();
        $('body').addClass('modal-scroll-lock modal-open-blur');
        $('body').css('top', -scrollPosition + 'px');

        // Resetear estados de animación gsap
        const $modal = $(this);
        if (typeof gsap !== "undefined") {
            gsap.set($modal.find('.tech-tag, .modal-info h3, .modal-description, .spec-list, .trust-box, .modal-cta-fixed'), {
                y: 30,
                opacity: 0
            });
        }

        var modalId = $(this).attr('id');
        var swiperElement = $(this).find('.modal-swiper')[0];

        if (swiperElement && !swiperInstances[modalId]) {
            setTimeout(function () {
                swiperInstances[modalId] = new Swiper(swiperElement, {
                    loop: true,
                    autoplay: {
                        delay: 3500,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }, 300);
        } else if (swiperElement && swiperInstances[modalId]) {
            swiperInstances[modalId].autoplay.start();
        }
    });

    $('.modal').on('shown.bs.modal', function () {
        const $modal = $(this);
        if (typeof gsap !== "undefined") {
            const tl = gsap.timeline();
            tl.to($modal.find('.tech-tag'), { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
              .to($modal.find('.modal-info h3'), { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
              .to($modal.find('.modal-description'), { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .to($modal.find('.spec-list'), { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .to($modal.find('.trust-box'), { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .to($modal.find('.modal-cta-fixed'), { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4");
        }
    });

    $('.modal').on('hidden.bs.modal', function () {
        var modalId = $(this).attr('id');
        if (swiperInstances[modalId]) {
            swiperInstances[modalId].autoplay.stop();
        }

        $('body').removeClass('modal-scroll-lock modal-open-blur');
        $('body').css('top', '');
        $(window).scrollTop(scrollPosition);
    });

    // ===== Animaciones gsap =====
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Animación para elementos con la clase lazy-load
        gsap.utils.toArray('.lazy-load').forEach(function(elem) {
            gsap.fromTo(elem, 
                { y: 50, opacity: 0 }, 
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animación de entrada para why cards (staggered)
        if ($('.why-card').length) {
            gsap.from(".why-card", {
                scrollTrigger: {
                    trigger: ".why-us-section",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power2.out"
            });
        }

        // Efecto tilt para service cards y why cards
        gsap.utils.toArray('.service-card, .why-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;

                gsap.to(card, {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    transformPerspective: 1000,
                    ease: "power2.out",
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: "power2.out",
                    duration: 0.5
                });
            });
        });

        // Animación de títulos con stagger
        gsap.utils.toArray('.gsap-title').forEach(title => {
            const text = title.textContent;
            title.innerHTML = text.split('').map(char => `<span style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`).join('');

            gsap.from(title.querySelectorAll('span'), {
                opacity: 0,
                y: 20,
                rotateX: -90,
                stagger: 0.02,
                duration: 0.8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%",
                }
            });
        });

        // Animación para elementos de la línea de tiempo
        gsap.utils.toArray('.timeline-item').forEach(function(item, index) {
            var isDesktop = $(window).width() > 767;
            var isLeft = index % 2 === 0;

            var startX = isDesktop ? (isLeft ? -50 : 50) : 0;
            var startY = isDesktop ? 0 : 50;

            gsap.fromTo(item,
                { x: startX, y: startY, opacity: 0 },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // ===== Manejo del loader de página =====
    var minTime = 1000; // Reducido de 3000ms a 1000ms para mayor rapidez
    var startTime = window.performance ? window.performance.now() : Date.now();
    var images = $('img');
    var totalImages = images.length;
    var imagesLoaded = 0;

    function formatProgress(percent) {
        $('#loaderProgressBar').css('width', percent + '%');
        $('#loaderPercentage').text(percent + '%');
    }

    function checkImageProgress() {
        var percentage = totalImages === 0 ? 100 : Math.floor((imagesLoaded / totalImages) * 100);
        formatProgress(percentage);
    }

    if (totalImages === 0) {
        checkImageProgress();
    } else {
        images.each(function() {
            if (this.complete) {
                imagesLoaded++;
                checkImageProgress();
            } else {
                $(this).on('load error', function() {
                    imagesLoaded++;
                    checkImageProgress();
                });
            }
        });
    }

    $(window).on('load', function () {
        imagesLoaded = totalImages;
        checkImageProgress();

        var currentTime = window.performance ? window.performance.now() : Date.now();
        var delay = Math.max(0, minTime - (currentTime - startTime));

        setTimeout(function () {
            $('html').removeClass('loading');
            $('body').removeClass('loading').addClass('loaded');

            $('#loader-wrapper').fadeOut(500, function () {
                if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
                    gsap.from(".hero-caption h2", { y: -30, opacity: 0, duration: 1, ease: "power2.out" });
                    gsap.from(".hero-caption p", { y: -20, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out" });
                    gsap.from(".hero-caption .btn-hero", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power2.out" });
                    gsap.from(".anniversary-badge", { scale: 0, opacity: 0, duration: 1, delay: 0.6, ease: "back.out(1.7)" });
                }
            });
        }, delay);
    });

    // ===== Validación y envío del formulario =====
    var contactForm = $('#contactForm');

    function validateField(input, feedback, regex, emptyMsg, invalidMsg, minLen = 0, maxLen = Infinity) {
        const value = $(input).val().trim();
        const $input = $(input);
        const $feedback = $(feedback);

        if (value === '') {
            $feedback.text(emptyMsg).addClass('error-text').removeClass('success-text');
            $input.addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (regex && !regex.test(value)) {
            $feedback.text(invalidMsg).addClass('error-text').removeClass('success-text');
            $input.addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (value.length < minLen) {
            $feedback.text(`Mínimo ${minLen} caracteres.`).addClass('error-text').removeClass('success-text');
            $input.addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (value.length > maxLen) {
            $feedback.text(`Máximo ${maxLen} caracteres.`).addClass('error-text').removeClass('success-text');
            $input.addClass('is-invalid').removeClass('is-valid');
            return false;
        } else {
            $feedback.text('').addClass('success-text').removeClass('error-text');
            $input.addClass('is-valid').removeClass('is-invalid');
            return true;
        }
    }

    const nameRegex = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜ]+$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    $('#nameInput').on('input blur', function() {
        validateField(this, '#nameFeedback', nameRegex, 'El nombre es obligatorio.', 'Solo letras y espacios.');
    });

    $('#emailInput').on('input blur', function() {
        validateField(this, '#emailFeedback', emailRegex, 'El correo es obligatorio.', 'Formato de correo no válido.');
    });

    $('#messageInput').on('input blur', function() {
        validateField(this, '#messageFeedback', null, 'El mensaje es obligatorio.', '', 10, 300);
    });

    contactForm.on('submit', function (event) {
        const isNameValid = validateField('#nameInput', '#nameFeedback', nameRegex, 'El nombre es obligatorio.', 'Solo letras y espacios.');
        const isEmailValid = validateField('#emailInput', '#emailFeedback', emailRegex, 'El correo es obligatorio.', 'Formato de correo no válido.');
        const isMessageValid = validateField('#messageInput', '#messageFeedback', null, 'El mensaje es obligatorio.', '', 10, 300);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            event.preventDefault();
            var errorList = $('#errorList');
            errorList.empty();
            if(!isNameValid) errorList.append('<li>Verifica el campo nombre</li>');
            if(!isEmailValid) errorList.append('<li>Verifica el campo correo</li>');
            if(!isMessageValid) errorList.append('<li>Verifica el campo mensaje (10-300 caracteres)</li>');
            $('#validationModal').addClass('is-visible');
            return;
        }
    });

    function closeValidationModal() {
        $('#validationModal').removeClass('is-visible');
    }

    $('.close-button, #validationModal').on('click', function (e) {
        if (e.target.id === 'validationModal' || $(e.target).hasClass('close-button')) {
            closeValidationModal();
        }
    });

    $('.validation-modal-content').on('click', function (e) {
        e.stopPropagation();
    });

    // ===== Visibilidad de botones flotantes =====
    var footer = document.querySelector('footer');
    var hero = document.querySelector('#hero');
    var centralCtaButton = $('.central-cta-button');
    
    function getChatContainer() {
        return $('.blaj-widget-container');
    }

    var isFooterVisible = false;

    function checkFloatingButtonsVisibility() {
        var scrollPosition = $(window).scrollTop();
        var heroHeight = $(hero).outerHeight() || 0;
        var chatContainer = getChatContainer();

        if (scrollPosition > heroHeight && !isFooterVisible) {
            centralCtaButton.addClass('is-visible');
        } else {
            centralCtaButton.removeClass('is-visible');
        }

        if (isFooterVisible) {
            centralCtaButton.addClass('floating-buttons-hidden');
            if (chatContainer.length) chatContainer.addClass('floating-buttons-hidden');
        } else {
            centralCtaButton.removeClass('floating-buttons-hidden');
            if (chatContainer.length) chatContainer.removeClass('floating-buttons-hidden');
        }
    }

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            isFooterVisible = entry.isIntersecting;
            checkFloatingButtonsVisibility();
        });
    }, observerOptions);

    if (footer) {
        observer.observe(footer);
    }

    $(window).on('scroll', function () {
        checkFloatingButtonsVisibility();
    });

    checkFloatingButtonsVisibility();

    // ===== Manejo del modo oscuro / claro =====
    const themeToggles = document.querySelectorAll('.theme-toggle-input');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggles.forEach(toggle => {
            toggle.checked = (currentTheme === 'dark');
        });
    }

    function switchTheme(e) {
        const isDark = e.target.checked;
        const newTheme = isDark ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        themeToggles.forEach(toggle => {
            toggle.checked = isDark;
        });
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', switchTheme, false);
    });
});
