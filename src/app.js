'use strict';

// Bootstrap js
import "../assets/js/vendor/bootstrap.min.js";
// Anchor Link Smooth Scroll js
import "../assets/js/smooth-scroll.js";
// Counter Up js
import "../assets/js/jquery.counterup.min.js";
// Owl Carousel js
// import "../assets/js/owl.carousel.min.js";
import "../assets/js/slick.min.js";
// Waypoints JS
import "../assets/js/waypoints.min.js";
// Contact Form Js
import "../assets/js/form-contact.js";
// Scroll to Top JS
import "../assets/js/jquery.ui.totop.js";
// Easing JS
import "../assets/js/jquery.easing.1.3.js";
// Retina JS
import "../assets/js/retina.min.js";
// Wow JS
// import "../assets/js/wow.min.js";
import 'wowjs';
// Main initialization js
import "../assets/js/main.js";
// import './styles.scss';
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'font-awesome/scss/font-awesome.scss';
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
