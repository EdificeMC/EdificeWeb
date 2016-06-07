'use strict';

import { AuthService } from '../services/auth';
import { email } from 'aurelia-validatejs';
import { ValidationEngine } from 'aurelia-validatejs';

export class SignupModel {
    @email email = '';
}

export class Signup {
    
    errors = [];

    static inject = [AuthService]
    constructor(auth) {
        this.auth = auth;
        this.model = new SignupModel();
        this.reporter = ValidationEngine.getValidationReporter(this.model);
        this.subscriber = this.reporter.subscribe(result => {
            console.log(result);
            this.renderErrors(result);
        });
    }

    renderErrors(result) {
        this.errors.splice(0, this.errors.length);
        result.forEach(error => {
            this.errors.push(error)
        });
    }
    
    signup() {
        return this.auth.signup({
            email: this.model.email,
            password: this.model.password,
            verificationCode: this.model.verificationCode
        });
    }
}
