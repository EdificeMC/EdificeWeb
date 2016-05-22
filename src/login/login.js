'use strict';

import { AuthService } from '../services/auth';
import { Router } from 'aurelia-router';

export class Login {

    static inject = [AuthService, Router];
    constructor(auth, http, router) {
        this.auth = auth;
        this.http = http;
        this.router = router;
    }

    login() {
        this.auth.login(this.email, this.password)
            .then(res => {
                console.log(res);
            });
    }

}
