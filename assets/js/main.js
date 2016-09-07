jQuery(function($) {
    'use strict';

    $(window).load(function() { // makes sure the whole site is loaded

        "use strict";

        /*
        =======================================================
            // Preloader
        ======================================================
        */
        $('.preloader').delay(4000).fadeOut('slow');


        /*
        =======================================================
            //Wow js initialization
        ======================================================
        */
        var wow = new WOW({
            offset: 100, // distance to the element when triggering the animation (default is 0)
            mobile: false // trigger animations on mobile devices (default is true)
        });
        wow.init();


    });


    $(document).ready(function() {

        /*=======================================================
            // SmoothScroll Initialization
        ======================================================*/
        smoothScroll.init({
            speed: 1000,
            easing: 'easeInOutCubic',
            offset: 0,
            updateURL: true,
            callbackBefore: function(toggle, anchor) {},
            callbackAfter: function(toggle, anchor) {}
        });


        /*=======================================================
            // App Screen Slider Initialization
        ======================================================*/
        $('#for-app-screen').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '#blue-app-screen'
        });

        $('#blue-app-screen').slick({
            centerMode: true,
            dots: true,
            arrows: false,
            centerPadding: '60px',
            slidesToShow: 3,
            asNavFor: '#for-app-screen',
            focusOnSelect: true,
            responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                  }
                }
            ]
        });


        /*=======================================================
            // Counter Up Initialization
        ======================================================*/
        $('.counting').counterUp({
            delay: 5,
            time: 1000
        });


        /*=======================================================
            Testimonial Slider
        ======================================================*/
        var owl = $("#owl-tm");
        owl.owlCarousel({
            items: 1,
            autoPlay: 5000,
            stopOnHover: true
        });


        if (navigator.userAgent.match(/Trident\/7\./)) {
            $('body').on("mousewheel", function() {
                event.preventDefault();
                var wd = event.wheelDelta;
                var csp = window.pageYOffset;
                window.scrollTo(0, csp - wd);
            });
        }

    });


    (function() {
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 80) {
                $(".navbar-brand").css({
                    'margin-top': '0',
                });
                $(".nav.navbar-nav").css({
                    'margin-top': '22px'
                });
                $(".navbar-default").css({
                    'background-color': 'rgba(24, 121, 253, 1)',
                    'transition': 'all 0.3s linear 0s'
                });
                $(".navbar-default").css({
                    'margin-top': '0px'
                });
            } else {
                $(".navbar-brand").css({
                    'margin-top': '30px'
                });
                $(".nav.navbar-nav").css({
                    'margin-top': '52px'
                });
                $(".navbar-default").css({
                    'background-color': 'transparent',
                    'border': '0px solid #ddd'
                });
            }
        });
    }());



});
