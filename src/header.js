'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from 'aurelia-auth';
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
        this.profile = window.localStorage.profile ? JSON.parse(window.localStorage.profile) : null;
        // showLogin value for initial load
        this.showLogin = this._shouldShowLogin();
        // Recompute showLogin when changing pages (don't show it on the login page)
        this.eventAggregator.subscribe('router:navigation:success', event => {
            this.showLogin = this._shouldShowLogin();
        });
        // Make showLogin false when logged in
        this.eventAggregator.subscribe('auth:login', event => {
            console.log("auth login event!");
            console.log(event);
            this.profile = event.selectedProfile;
            this.profile.headImageURL = 'https://crafatar.com/avatars/' + this.profile.id;
            window.localStorage.setItem('profile', JSON.stringify(event.selectedProfile));
            this.showLogin = false;
        });
        
        this.eventAggregator.subscribe('auth:logout', () => {
            console.log("logout event");
            this.profile = null;
            this.showLogin = this._shouldShowLogin();
        });
    }

    // Show the login button if the user is not already logged in and is not currently on the login page
    _shouldShowLogin() {
        return !this.auth.isAuthenticated() && this.router.currentInstruction.config.route !== 'login';
    }

    // I am providing this getter rather than forcing the direct use of auth.isAuthenticated() because Aurelia doesn't seem to listen to
    // changes to auth.isAuthenticated() for whatever reason
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }

}
