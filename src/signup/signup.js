'use strict';

import { Validation } from 'aurelia-validation';

export class Signup {

    static inject = [Validation];
    constructor(validation) {
        // this.validation = validation.on(this)
        //     .ensure('email').isNotEmpty().isEmail()
    }

    activate(params) {
        this.params = params;
    }

    attached() {
        this.verificationCode = this.params.verificationCode;
    }

}
