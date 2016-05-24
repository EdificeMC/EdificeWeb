'use strict';

import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from 'aurelia-auth';
import { Router } from 'aurelia-router';

export class HeaderCustomElement {

    static inject = [AuthService, EventAggregator, Router];
    constructor(auth, eventAggregator, router) {
        this.auth = auth;
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    attached() {
        this.showLogin = !this.auth.isAuthenticated() && this.router.currentInstruction.config.route !== 'login';
        this.eventAggregator.subscribe('router:navigation:success', event => {
            this.showLogin = !this.auth.isAuthenticated() && event.instruction.config.route !== 'login';
        });
    }
    
}
