'use strict';

import { NotifyService } from '../../services/notify';
import { AuthService } from '../../services/auth';
import { HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router';
import { bindable } from 'aurelia-framework';

export class StructureBlurbCustomElement {
    @bindable structure;
    
    static inject = [HttpClient, AuthService, NotifyService, Router];
    constructor(http, auth, notify, router) {
        this.http = http;
        this.auth = auth;
        this.notify = notify;
        this.router = router;
    }
    
    attached() {
        this.structureIsStarred = this.auth.isAuthenticated && this.structure.stargazers.includes(this.auth.profile.id);
    }
    
    star() {
        if (!this.auth.isAuthenticated) {
            this.notify.error('You must log in first.', {
                progressBar: true,
                onclick: () => {
                    this.router.navigate('login');
                }
            });
            return;
        }
        return this.http.createRequest('/star')
            .asPost()
            .withContent({
                structureId: this.structure._id
            })
            .withHeader('Authorization', 'Bearer ' + this.auth.accessToken)
            .send()
            .then(res => {
                if(this.structureIsStarred) {
                    this.structure.stargazers.splice(this.structure.stargazers.indexOf(this.auth.profile.id), 1);
                    this.structureIsStarred = false;
                } else {
                    this.structure.stargazers.push(this.auth.profile.id);
                    this.structureIsStarred = true;
                }
            });
    }
}
