'use strict';

//
// JS
//
import 'bootstrap';
import smoothScroll from 'smooth-scroll';
import wow from 'wowjs'; // scrolling animations
import $ from 'jquery';

//
// CSS
//
import '../assets/css/preloader.css';
import '../assets/sass/style.scss';
// import './styles.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import 'animate.css/animate.min.css';
import 'toastr/build/toastr.min.css';
import 'sweetalert/dist/sweetalert.css';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from './services/auth';
import toastr from 'toastr';

$.fn.extend({
    animateCSS: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if(callback) {
                callback();
            }
        });
    }
});

export class App {
    static inject = [HttpClient, EventAggregator, AuthService];
    constructor(http, eventAggregator, auth) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.auth = auth;
        
        eventAggregator.subscribe('router:navigation:processing', function() {
            // Clean up any old toasts from the previous page
            toastr.clear();
        });
    }

    activate() {
        this.http.configure(x => {
            x.withHeader('Accept', 'application/json');
            x.withBaseUrl(API_URL);
        });
    }

    attached() {
        // Restore the profile from storage
        // showLogin value for initial load
        this.showLogin = this._shouldShowLogin();
        // Recompute showLogin when changing pages (don't show it on the login page)
        this.eventAggregator.subscribe('router:navigation:success', () => {
            this.showLogin = this._shouldShowLogin();
        });
        // Make showLogin false when logged in
        this.eventAggregator.subscribe('auth:login', () => {
            this.showLogin = false;
        });
        
        this.eventAggregator.subscribe('auth:logout', () => {
            this.showLogin = this._shouldShowLogin();
        });
        
        $('.preloader').delay(2000).fadeOut('slow');

        new wow.WOW({
            offset: 100, // distance to the element when triggering the animation (default is 0)
            mobile: false // trigger animations on mobile devices (default is true)
        }).init();

        if (navigator.userAgent.match(/Trident\/7\./)) {
            $('body').on('mousewheel', function() {
                event.preventDefault();
                var wd = event.wheelDelta;
                var csp = window.pageYOffset;
                window.scrollTo(0, csp - wd);
            });
        }

    }
    
    // HACK: Only for use on the home page (this really shouldn't be in the App class)
    scrollTo(sectionId) {
        smoothScroll.animateScroll(document.querySelector('#' + sectionId), null, {
            speed: 1000,
            easing: 'easeInOutCubic'
        });
    }
    
    // Show the login button if the user is not already logged in and is not currently on the login page
    _shouldShowLogin() {
        return !this.auth.isAuthenticated && this.router.currentInstruction.config.route !== 'login';
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
