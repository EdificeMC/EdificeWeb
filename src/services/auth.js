'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

export class AuthService {
    
    static inject = [HttpClient, EventAggregator];
    constructor(http, eventAggregator) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        
        this._profile = window.localStorage.profile ? JSON.parse(window.localStorage.profile) : null;
        this._accessToken = window.localStorage.accessToken;
    }
    
    signup(credentials) {
        return this.http.post('/auth/signup', credentials)
            .then(res => res.content)
            .then(res => {
                this._profile = res.profile;
                this._profile.headImageURL = 'https://crafatar.com/avatars/' + this._profile.uuid + '?size=32';
                window.localStorage.setItem('profile', JSON.stringify(this._profile));
                this._accessToken = res.accessToken;
                window.localStorage.setItem('accessToken', this._accessToken);
                
                this.eventAggregator.publish('auth:login', res);
            })
    }
    
    login(email, password) {
        return this.http.post('/auth/login', {email, password})
            .then(res => res.content)
            .then(res => {
                this._profile = res.profile;
                this._profile.headImageURL = 'https://crafatar.com/avatars/' + this._profile.uuid + '?size=32';
                window.localStorage.setItem('profile', JSON.stringify(this._profile));
                this._accessToken = res.accessToken;
                window.localStorage.setItem('accessToken', this._accessToken);
                
                this.eventAggregator.publish('auth:login', res);
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
