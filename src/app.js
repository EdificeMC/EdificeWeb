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
            x.withBaseUrl('http://localhost:3000/');
        });
    }
    configureRouter(config, router) {
        config.title = 'Edifice';
        config.map([{
            route: ['', 'home'],
            name: 'home',
            moduleId: 'home/home'
        }]);
        this.router = router;
    }
}
