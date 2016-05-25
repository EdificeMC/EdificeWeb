'use strict';

import { AuthService } from 'aurelia-auth';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

export class Login {

    static inject = [AuthService, EventAggregator, Router];
    constructor(auth, eventAggregator, router) {
        this.auth = auth;
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    login() {
        this.auth.login(this.email, this.password)
            .then(res => {
                // TODO make an alert w/ "Welcome, ______"
                this.router.navigate('/');
                // Publishing the event HAS to be after changing the page since the event listener depends on the current route
                // this.eventAggregator.publish('auth:login', res);
            });
    }

}
