'use strict';

import 'bootstrap';
import { HttpClient } from 'aurelia-http-client';

export class App {
    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate() {
        this.http.configure(x => {
            x.withHeader('Accept', 'application/json');
            x.withBaseUrl('http://localhost:3000/api/');
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
            route: 'create/:id',
            name: 'create',
            moduleId: 'create/create',
            title: 'Create Structure'
        }]);
        this.router = router;
    }
}
