'use strict';

import './styles.scss';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import 'toastr/build/toastr.min.css';
import 'sweetalert/dist/sweetalert.css';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import toastr from 'toastr';

export class App {
    static inject = [HttpClient, EventAggregator];
    constructor(http, eventAggregator) {
        this.http = http;
        eventAggregator.subscribe('router:navigation:processing', function(event) {
            // Clean up any old toasts from the previous page
            toastr.clear();
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
            route: 'create/:id',
            name: 'create',
            moduleId: 'create/create',
            title: 'Create Structure'
        }]);
        this.router = router;
    }
}
