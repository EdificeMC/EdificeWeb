'use strict';

import { AuthService } from '../../services/auth';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable } from 'aurelia-framework';
import Clipboard from 'clipboard';
import toastr from 'toastr';

export class StructureBlurbCustomElement {
    @bindable structure;
    createStructureCmdPrefix = '/edifice create ';
    
    static inject = [HttpClient, AuthService, EventAggregator];
    constructor(http, auth, eventAggregator) {
        this.http = http;
        this.auth = auth;
        this.eventAggregator = eventAggregator;
    }
    
    attached() {
        new Clipboard('#buildStructureBtn');
        
        this.structureIsStarred = this.auth.isAuthenticated && this.structure.stargazers.includes(this.auth.profile.app_metadata.mcuuid);
        // Reevaluate if the structure is starred upon login
        this.eventAggregator.subscribe('auth:login', event => {
            this.structureIsStarred = this.auth.isAuthenticated && this.structure.stargazers.includes(this.auth.profile.app_metadata.mcuuid);
        });
    }
    
    star() {
        if (!this.auth.isAuthenticated) {
            toastr.error('You must log in first.', null, {
                progressBar: true,
                onclick: () => {
                    this.auth.login();
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
                    this.structure.stargazers.splice(this.structure.stargazers.indexOf(this.auth.profile.app_metadata.mcuuid), 1);
                    this.structureIsStarred = false;
                } else {
                    this.structure.stargazers.push(this.auth.profile.app_metadata.mcuuid);
                    this.structureIsStarred = true;
                }
            });
    }
}
