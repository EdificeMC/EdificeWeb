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
    }
}
