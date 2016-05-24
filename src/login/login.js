'use strict';

import { AuthService } from 'aurelia-auth';
import { Router } from 'aurelia-router';

export class Login {

    static inject = [AuthService, Router];
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }

    login() {
        this.auth.login(this.email, this.password)
            .then(res => {
                // TODO make an alert w/ "Welcome, ______"
                this.router.navigate('/');
            });
    }

}
