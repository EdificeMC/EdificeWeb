'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import Auth0Lock from 'auth0-lock';

export class AuthService {

    static inject = [HttpClient, EventAggregator, Router];
    constructor(http, eventAggregator, router) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.router = router;

        this.lock = new Auth0Lock('i63XQ7QPVnHNadBrvCyWVGvaUPqAGxCn', 'edifice.auth0.com');

        this._profile = window.localStorage.profile ? JSON.parse(window.localStorage.profile) : null;
        this._accessToken = window.localStorage.accessToken;
    }

    signup(credentials) {
        return this.http.post('/auth/signup', credentials);
    }

    login() {
        this.lock.showSignin((err, profile, token) => {
            this._profile = profile;
            window.localStorage.setItem('profile', JSON.stringify(this._profile));
            this._accessToken = token;
            window.localStorage.setItem('accessToken', this._accessToken);

            this.eventAggregator.publish('auth:login', profile);
        })
    }

    logout() {
        this._profile = null;
        this._accessToken = null;
        window.localStorage.removeItem('profile');
        window.localStorage.removeItem('accessToken');

        this.eventAggregator.publish('auth:logout');
    }

    get isAuthenticated() {
        return !!this._accessToken;
        // TODO Check expiration
    }

    get accessToken() {
        return this._accessToken;
    }

    get profile() {
        return this._profile;
    }

    set profile(newProfile) {
        this._profile = newProfile;
    }
}
