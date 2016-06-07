'use strict';

import { AuthService } from '../services/auth';
import toastr from 'toastr';
import swal from 'sweetalert';
// import { email } from 'aurelia-validatejs';
// import { ValidationEngine } from 'aurelia-validatejs';

// export class SignupModel {
//     @email email = '';
// }

export class Signup {
    
    errors = [];

    static inject = [AuthService]
    constructor(auth) {
        this.auth = auth;
        // this.model = new SignupModel();
        // this.reporter = ValidationEngine.getValidationReporter(this.model);
        // this.subscriber = this.reporter.subscribe(result => {
        //     console.log(result);
        //     this.renderErrors(result);
        // });
    }

    renderErrors(result) {
        this.errors.splice(0, this.errors.length);
        result.forEach(error => {
            this.errors.push(error)
        });
    }
    
    signup() {
        return this.auth.signup({
            email: this.email,
            password: this.password,
            verificationCode: this.verificationCode
        }).then((res) => {
            swal({
                title: "Welcome!",
                text: `Please confirm your account with the email sent to ${credentials.email}`,
                type: 'success'
            }, () => {
                this.router.navigate('/');
            });
        }).catch(err => {
            toastr.error(err.content.message, null, {
                progressBar: true
            });
        });;
    }
}
