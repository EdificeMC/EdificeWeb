'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

export class AuthService {
    
    static inject = [HttpClient, EventAggregator];
    constructor(http, eventAggregator) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        
        this._profile = window.localStorage.profile ? JSON.parse(window.localStorage.profile) : null;
        this._clientToken = window.localStorage.clientToken;
        this._accessToken = window.localStorage.accessToken;
    }
    
    login(username, password) {
        return this.http.post('/auth/login', {username, password})
            .then(res => res.content)
            .then(res => {
                this._profile = res.selectedProfile;
                this._profile.headImageURL = 'https://crafatar.com/avatars/' + this._profile.id + '?size=32';
                window.localStorage.setItem('profile', JSON.stringify(this._selectedProfile));
                this._accessToken = res.accessToken;
                window.localStorage.setItem('accessToken', this._accessToken);
                this._clientToken = res.clientToken;
                window.localStorage.setItem('clientToken', this._clientToken);
                
                this.eventAggregator.publish('auth:login', res);
            })
    }
    
    logout() {
        window.localStorage.removeItem('profile');
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('clientToken');
        
        return this.http.post('/auth/logout', {
            clientToken: this._clientToken,
            accessToken: this._accessToken
        }).then(res => {
            this._profile = null;
            this._accessToken = null;
            this._clientToken = null;
            
            this.eventAggregator.publish('auth:logout');
        });
    }
    
    get isAuthenticated() {
        return !!this._accessToken;
    }
    
    get profile() {
        return this._profile;
    }
    
    set profile(newProfile) {
        this._profile = newProfile;
    }
}
