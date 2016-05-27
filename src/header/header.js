'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from '../services/auth';
import { Router } from 'aurelia-router';

export class HeaderCustomElement {

    static inject = [HttpClient, AuthService, EventAggregator, Router];
    constructor(http, auth, eventAggregator, router) {
        this.http = http;
        this.auth = auth;
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    attached() {
        // Restore the profile from storage
        // showLogin value for initial load
        this.showLogin = this._shouldShowLogin();
        // Recompute showLogin when changing pages (don't show it on the login page)
        this.eventAggregator.subscribe('router:navigation:success', event => {
            this.showLogin = this._shouldShowLogin();
        });
        // Make showLogin false when logged in
        this.eventAggregator.subscribe('auth:login', event => {
            this.showLogin = false;
        });
        
        this.eventAggregator.subscribe('auth:logout', () => {
            this.showLogin = this._shouldShowLogin();
        });
    }

    // Show the login button if the user is not already logged in and is not currently on the login page
    _shouldShowLogin() {
        return !this.auth.isAuthenticated && this.router.currentInstruction.config.route !== 'login';
    }

}
