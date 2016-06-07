'use strict';

import { AuthService } from '../../services/auth';
import { HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router';
import { bindable } from 'aurelia-framework';
import toastr from 'toastr';

export class StructureBlurbCustomElement {
    @bindable structure;
    
    static inject = [HttpClient, AuthService, Router];
    constructor(http, auth, notify, router) {
        this.http = http;
        this.auth = auth;
        this.router = router;
    }
    
    attached() {
        this.structureIsStarred = this.auth.isAuthenticated && this.structure.stargazers.includes(this.auth.profile.id);
    }
    
    star() {
        if (!this.auth.isAuthenticated) {
            toastr.error('You must log in first.', null, {
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
                // Rather than doing another request to get the number of stars, we'll manually increment/decrement it
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
