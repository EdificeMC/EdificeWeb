'use strict';

//
// JS
//
import 'bootstrap';
import smoothScroll from 'smooth-scroll';
import 'slick-carousel/slick/slick.min.js';
import wow from 'wowjs'; // scrolling animations

//
// CSS
//
import '../assets/css/preloader.css';
import '../assets/sass/style.scss';
// import './styles.scss';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import 'animate.css/animate.min.css';
import 'toastr/build/toastr.min.css';
import 'sweetalert/dist/sweetalert.css';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import toastr from 'toastr';

export class App {
    static inject = [HttpClient, EventAggregator];
    constructor(http, eventAggregator) {
        this.http = http;
        this.isLoading = true;
        eventAggregator.subscribe('router:navigation:processing', function(event) {
            // Clean up any old toasts from the previous page
            toastr.clear();
        });
        eventAggregator.subscribe('router:navigation:success', () => {
            this.isLoading = false;
        })
    }

    activate() {
        this.http.configure(x => {
            x.withHeader('Accept', 'application/json');
            x.withBaseUrl(API_URL);
        });
    }

    attached() {
        $('.preloader').delay(2000).fadeOut('slow');

        new wow.WOW({
            offset: 100, // distance to the element when triggering the animation (default is 0)
            mobile: false // trigger animations on mobile devices (default is true)
        }).init();

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

        if (navigator.userAgent.match(/Trident\/7\./)) {
            $('body').on('mousewheel', function() {
                event.preventDefault();
                var wd = event.wheelDelta;
                var csp = window.pageYOffset;
                window.scrollTo(0, csp - wd);
            });
        }
        
        function adjustNavbarCSS() {
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
        }

        adjustNavbarCSS();
        $(window).on('scroll', adjustNavbarCSS);
    }

    configureRouter(config, router) {
        config.title = 'Edifice';
        config.map([{
            route: ['', 'home'],
            name: 'home',
            moduleId: 'home/home',
            nav: true
        }, {
            route: 'signup',
            name: 'signup',
            moduleId: 'signup/signup'
        }, {
            route: 'profile/:playerId',
            name: 'profile',
            moduleId: 'profile/profile'
        }, {
            route: 'structure/:id',
            name: 'structure-view',
            moduleId: 'structure-view/structure-view'
        }, {
            route: 'structure/:id/stargazers',
            name: 'structure-stars',
            moduleId: 'structure-stars/structure-stars'
        }, {
            route: 'edit/:id',
            name: 'edit',
            moduleId: 'edit/edit',
            title: 'Edit Structure'
        }]);
        this.router = router;
    }
}
