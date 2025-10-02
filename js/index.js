$(document).ready(function() {
    // Smooth scrolling para los enlaces del navbar
    $('a.navbar-brand, .nav a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });

    // Cambiar el estilo del navbar al hacer scroll
    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Código para el efecto blur del modal
    $('.modal').on('show.bs.modal', function () {
        $('body').addClass('modal-open-blur');
    });

    $('.modal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open-blur');
    });

    // ===== MANEJO DEL MENÚ MÓVIL =====

    // Cerrar menú cuando se hace clic en cualquier enlace
    $('.navbar-nav a').on('click', function() {
        if ($(window).width() <= 767) {
            $('.navbar-collapse').removeClass('in');
            $('.navbar-toggle').addClass('collapsed');
            $('.navbar-toggle').attr('aria-expanded', 'false');
            
            $('body').removeClass('navbar-open');
            // Restaurar scroll position
            var scrollTop = parseInt($('body').data('scroll-position') || '0');
            $('body').css('top', '');
            $(window).scrollTop(scrollTop);
        }
    });

    // Cerrar menú si se hace clic fuera del navbar en móvil
    $(document).on('click', function(e) {
        if ($(window).width() <= 767) {
            if (!$(e.target).closest('.navbar').length && $('.navbar-collapse').hasClass('in')) {
                $('.navbar-collapse').removeClass('in');
                $('.navbar-toggle').addClass('collapsed');
                $('.navbar-toggle').attr('aria-expanded', 'false');
                
                $('body').removeClass('navbar-open');
                // Restaurar scroll position
                var scrollTop = parseInt($('body').data('scroll-position') || '0');
                $('body').css('top', '');
                $(window).scrollTop(scrollTop);
            }
        }
    });

    // Limpiar clases si se cambia el tamaño de ventana
    $(window).on('resize', function() {
        if ($(window).width() > 767) {
            $('body').removeClass('navbar-open');
            $('body').css('top', '');
        }
        handleServicesLink();
    });

    // Manejar el enlace de servicios en móvil vs desktop
    function handleServicesLink() {
        var servicesListItem = $('li.dropdown');
        var servicesLink = servicesListItem.find('a').first();
        var servicesDropdownMenu = servicesListItem.find('.dropdown-menu');
        var caret = servicesLink.find('.caret');

        if ($(window).width() <= 767) {
            // En móvil: convertir a enlace directo y ocultar dropdown
            servicesListItem.removeClass('dropdown');
            servicesLink.attr('href', '#services');
            servicesLink.removeAttr('data-toggle');
            servicesLink.removeAttr('role');
            servicesLink.removeAttr('aria-haspopup');
            servicesLink.removeAttr('aria-expanded');
            caret.hide();
            servicesDropdownMenu.hide();
            
            // Asegurar que el dropdown esté completamente oculto
            servicesDropdownMenu.css({
                'display': 'none',
                'visibility': 'hidden',
                'opacity': '0',
                'height': '0',
                'overflow': 'hidden'
            });
            
            // Prevenir cualquier evento de hover o click en el dropdown
            servicesDropdownMenu.off('click mouseenter mouseleave');
            
        } else {
            // En desktop: mantener como dropdown
            servicesListItem.addClass('dropdown');
            servicesLink.attr('href', '#');
            servicesLink.attr('data-toggle', 'dropdown');
            servicesLink.attr('role', 'button');
            servicesLink.attr('aria-haspopup', 'true');
            servicesLink.attr('aria-expanded', 'false');
            caret.show();
            servicesDropdownMenu.show();
            
            // Restaurar estilos normales del dropdown
            servicesDropdownMenu.css({
                'display': '',
                'visibility': '',
                'opacity': '',
                'height': '',
                'overflow': ''
            });
        }
    }

    handleServicesLink();

    $(document).on('click touchstart', function(e) {
        if ($(window).width() <= 767) {
            // Si se hace click en el enlace de servicios en móvil, asegurar que no se abra dropdown
            if ($(e.target).closest('.dropdown-toggle').length) {
                e.preventDefault();
                // Si es el enlace de servicios, navegar a la sección
                if ($(e.target).closest('.dropdown-toggle').attr('href') === '#services') {
                    $('html, body').animate({
                        scrollTop: $('#services').offset().top
                    }, 800);
                    
                    // Cerrar el menú móvil
                    $('.navbar-collapse').removeClass('in');
                    $('.navbar-toggle').addClass('collapsed');
                    $('.navbar-toggle').attr('aria-expanded', 'false');
                    $('body').removeClass('navbar-open');
                }
            }
        }
    });

    var scrollPosition = 0;
    var swiperInstances = {};

    $('.modal').on('show.bs.modal', function () {
        scrollPosition = $(window).scrollTop();
        $('body').addClass('modal-scroll-lock modal-open-blur');
        $('body').css('top', -scrollPosition + 'px');

        var modalId = $(this).attr('id');
        var swiperElement = $(this).find('.modal-swiper')[0];

        if (swiperElement && !swiperInstances[modalId]) {
            setTimeout(function() {
                swiperInstances[modalId] = new Swiper(swiperElement, {
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }, 200);
        } else if (swiperElement && swiperInstances[modalId]) {
            swiperInstances[modalId].autoplay.start();
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

    // ===== ANIMACIÓN PARA LA LÍNEA DE TIEMPO (HISTORIA) =====
    function animateTimeline() {
        var timelineItems = $('.timeline-item');
        var windowHeight = $(window).height();
        var windowScrollTop = $(window).scrollTop();

        timelineItems.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            
            // Si el elemento está en el viewport (con un pequeño offset)
            if (elementTop < windowScrollTop + windowHeight - 100) {
                element.addClass('is-visible');
            }
        });
    }

    // Ejecutar la función al cargar y al hacer scroll
    animateTimeline();
    $(window).on('scroll', animateTimeline);

    // ===== MANEJO DEL LOADER DE PÁGINA =====
    $(window).on('load', function() {
        $('body').addClass('loaded');
        setTimeout(function() {
            $('#loader-wrapper').css('display', 'none');
        }, 500); // Coincide con la duración de la transición en el CSS
    });

    // ===== ANIMACIÓN "INFINITA" EN SCROLL (LAZY LOADING) =====
    function handleScrollAnimations() {
        // Selecciona todos los elementos que deben animarse
        var elementsToAnimate = $('.lazy-load, .timeline-item');
        var windowHeight = $(window).height();
        var windowTop = $(window).scrollTop();
        var windowBottom = windowTop + windowHeight;

        $.each(elementsToAnimate, function() {
            var element = $(this);
            var elementHeight = element.outerHeight();
            var elementTop = element.offset().top;
            var elementBottom = elementTop + elementHeight;

            // Comprueba si el elemento está visible en la pantalla
            if ((elementBottom >= windowTop) && (elementTop <= windowBottom)) {
                element.addClass('is-visible');
            } else {
                // Si no está visible, le quita la clase para que la animación se repita
                element.removeClass('is-visible');
            }
        });
    }

    // Ejecutar la función al cargar y al hacer scroll
    handleScrollAnimations();
    $(window).on('scroll', handleScrollAnimations);

    // ===== VALIDACIÓN Y ENVÍO DEL FORMULARIO CON FORMSPREE (AJAX) =====
    var contactForm = $('#contactForm');

    contactForm.on('submit', function(event) {
        event.preventDefault(); 

        var errors = [];
        var name = $('#nameInput').val();
        var email = $('#emailInput').val();
        var message = $('#messageInput').val();
        var uniqueErrors = new Set();

        if (name.trim() === '') { uniqueErrors.add("El campo 'Nombre' es obligatorio."); }
        if (email.trim() === '') { uniqueErrors.add("El campo 'Correo electrónico' es obligatorio."); }
        if (message.trim() === '') { uniqueErrors.add("El campo 'Mensaje' es obligatorio."); }
        
        var namePattern = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜ]+$/;
        if (name.trim() !== '' && !namePattern.test(name)) { uniqueErrors.add("El nombre solo puede contener letras y espacios."); }
        
        var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (email.trim() !== '' && !emailPattern.test(email)) { uniqueErrors.add("Por favor, introduce un correo electrónico válido."); }
        
        if (message.length > 350) { uniqueErrors.add("El mensaje no puede superar los 350 caracteres."); }

        errors = Array.from(uniqueErrors);

        if (errors.length > 0) {
            var errorList = $('#errorList');
            errorList.empty();
            $.each(errors, function(index, error) { errorList.append('<li>' + error + '</li>'); });
            
            // Ya no se activa el blur aquí
            $('#validationModal').addClass('is-visible');
        } else {
            var formData = new FormData(this);
            var form = this;

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                if (response.ok) {
                    form.reset();
                    // Ya no se activa el blur aquí
                    $('#successModal').addClass('is-visible');
                } else {
                    response.json().then(function(data) {
                        if (Object.hasOwn(data, 'errors')) {
                            var serverErrors = data['errors'].map(function(error) { return error['message']; }).join(', ');
                            alert("Oops! Hubo un problema: " + serverErrors);
                        } else {
                            alert("Oops! Hubo un problema al enviar el formulario.");
                        }
                    });
                }
            }).catch(function(error) {
                alert("Oops! Hubo un problema de red al enviar el formulario.");
            });
        }
    });

    // --- Lógica para cerrar los modales ---
    function closeValidationModal() {
        $('#validationModal').removeClass('is-visible');
    }

    function closeSuccessModal() {
        $('#successModal').removeClass('is-visible');
    }

    $('.close-button, #validationModal').on('click', function(e) {
        if (e.target.id === 'validationModal' || $(e.target).hasClass('close-button')) {
            closeValidationModal();
        }
    });

    $('#closeSuccessModal, #successModal').on('click', function(e) {
        if (e.target.id === 'successModal' || e.target.id === 'closeSuccessModal') {
            closeSuccessModal();
        }
    });

    $('.validation-modal-content').on('click', function(e) {
        e.stopPropagation();
    });

    // ===== LÓGICA DEL CHAT VIRTUAL =====
    var chatToggle = $('#chat-toggle');
    var chatWindow = $('#chat-window');
    var chatBody = $('#chat-body');
    var chatInput = $('#chat-input');
    
    // Almacenamos el mensaje inicial para reutilizarlo
    var initialBotMessage = chatBody.html();

    var chatResponses = {
        '1': 'Ofrecemos soluciones integrales para la industria: Obra civil, Montaje y nivelación de maquinaria, Reparación de equipos, Fabricación de sistemas hidráulicos/neumáticos e Instalación de tuberías especializadas.',
        '2': 'Somos una empresa familiar con 50 años de experiencia, fundada por el Ing. Andrés Tijerina Cruz. Nuestra trayectoria es garantía de calidad y conocimiento técnico.',
        '3': 'Para solicitar una cotización formal, puedes <a href="https://wa.link/osrcg2" target="_blank">cotizar tu proyecto aquí</a>. Un especialista te atenderá a la brevedad.',
        '4': 'Nuestras oficinas se encuentran en Níspero 2406 Ote, Jardines de la Moderna, en Monterrey, Nuevo León.',
        '5': 'Nuestro horario de oficina es de Lunes a Viernes de 9:00 a.m. a 6:00 p.m.',
        '6': 'Para hablar con un miembro de nuestro equipo, puedes llamarnos al celular <strong>81 2944 6404</strong> o dejarnos un mensaje en nuestro <a href="#contact" class="chat-link">formulario de contacto</a> o <a href="https://wa.link/osrcg2" target="_blank">Cotizar tu proyecto aquí</a>. ¡Será un gusto atenderte!'
    };

    // Abrir y cerrar el chat
    chatToggle.on('click', function() {
        chatWindow.toggleClass('is-visible');
        if (!chatWindow.hasClass('is-visible')) {
            // Restaura el chat a su estado inicial al cerrar
            setTimeout(function() {
                chatBody.html(initialBotMessage);
            }, 500);
        }
    });

    // Procesar la pregunta del usuario
    chatInput.on('keypress', function(e) {
        if (e.which == 13) { // Tecla Enter
            var userQuestion = $(this).val().trim();
            if (chatResponses[userQuestion]) {
                var userMessageHTML = '<div class="chat-message user"><p>' + userQuestion + '</p></div>';
                chatBody.append(userMessageHTML);

                setTimeout(function() {
                    var botResponseHTML = '<div class="chat-message bot"><p>' + chatResponses[userQuestion] + '</p></div>';
                    chatBody.append(botResponseHTML);
                    chatBody.scrollTop(chatBody[0].scrollHeight);

                    // NUEVA FUNCIONALIDAD: Vuelve a mostrar las preguntas después de 5 segundos
                    setTimeout(function() {
                        var repromptHTML = '<div class="chat-message bot"><p>¿Puedo ayudarte con algo más? Aquí tienes las opciones de nuevo:</p>' + 
                                           $(initialBotMessage).find('.questions-list').prop('outerHTML') + 
                                           '</div>';
                        chatBody.append(repromptHTML);
                        chatBody.scrollTop(chatBody[0].scrollHeight);
                    }, 7000); // 5 segundos de espera

                }, 500);
            }
            $(this).val('');
        }
    });
    
    // Cerrar el chat al hacer clic en un enlace interno
    chatBody.on('click', '.chat-link', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({ scrollTop: $(target).offset().top }, 800);
        chatWindow.removeClass('is-visible');
    });

    // Cerrar el chat al hacer clic fuera de él
    $(document).on('click', function(e) {
        if (chatWindow.hasClass('is-visible') && !$(e.target).closest('#chat-container').length) {
            chatWindow.removeClass('is-visible');
        }
    });

    // ===== OCULTAR BOTONES FLOTANTES AL LLEGAR AL FOOTER =====
    var footer = document.querySelector('footer');
    var centralCtaButton = $('.central-cta-button');
    var chatContainer = $('#chat-container');

    // Opciones para el observador: se activará cuando el footer esté a 100px de entrar en pantalla
    var observerOptions = {
        root: null, // El viewport
        rootMargin: '0px 0px -100px 0px',
        threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Si el footer está visible, oculta los botones
                centralCtaButton.addClass('floating-buttons-hidden');
                chatContainer.addClass('floating-buttons-hidden');
            } else {
                // Si el footer no está visible, muestra los botones
                centralCtaButton.removeClass('floating-buttons-hidden');
                chatContainer.removeClass('floating-buttons-hidden');
            }
        });
    }, observerOptions);

    // Iniciar la observación del footer
    if (footer) {
        observer.observe(footer);
    }
});