'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from 'aurelia-auth';
import { Router } from 'aurelia-router';
import PNGReader from 'png.js';

export class HeaderCustomElement {

    static inject = [HttpClient, AuthService, EventAggregator, Router];
    constructor(http, auth, eventAggregator, router) {
        this.http = http;
        this.auth = auth;
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    attached() {
        // showLogin value for initial load
        this.showLogin = this._shouldShowLogin();
        // Recompute showLogin when changing pages (don't show it on the login page)
        this.eventAggregator.subscribe('router:navigation:success', event => {
            this.showLogin = this._shouldShowLogin();
        });
        // Make showLogin false when logged in
        this.eventAggregator.subscribe('auth:login', event => {
            // Get player face/skin from Crafatar
            this.http.get('https://crafatar.com/avatars/' + event.selectedProfile.id)
                .then(res => {
                    console.log(res);
                    return new Promise((resolve, reject) => {
                        new PNGReader(res.response).parse(function(err, png) {
                            if(err) {
                                return reject(err);
                            }
                            return resolve(png);
                        })
                    });
                }).then(png => {
                    console.log(png);
                })
            this.showLogin = false;
        });
    }

    // Show the login button if the user is not already logged in and is not currently on the login page
    _shouldShowLogin() {
        return !this.auth.isAuthenticated() && this.router.currentInstruction.config.route !== 'login';
    }

    logout() {
        this.auth.logout();
        this.playerProfile = null;
        this.showLogin = this._shouldShowLogin();
    }

    // I am providing this getter rather than forcing the direct use of auth.isAuthenticated() because Aurelia doesn't seem to listen to
    // changes to auth.isAuthenticated() for whatever reason
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }

}
