'use strict';

import './styles.scss';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import { HttpClient } from 'aurelia-http-client';

export class App {
    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate() {
        // If running on localhost, point all API requests to port 3000
        // If running in prod, points to the IP address of the server
        let urlBase = window.location.hostname;
        if(window.location.hostname === 'localhost') {
            urlBase = 'localhost:3000';
        }
        this.http.configure(x => {
            x.withHeader('Accept', 'application/json');
            x.withBaseUrl('http://' + urlBase + '/api/');
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
            route: 'login',
            name: 'login',
            moduleId: 'login/login'
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
