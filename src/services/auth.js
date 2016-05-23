'use strict';

import { HttpClient } from 'aurelia-http-client';

export class AuthService {

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    login(email, password) {
        let body = {
            agent: {
              name: "Minecraft",
              version: 1
            },
            username: email,
            password
        }
        this.http.post('https://authserver.mojang.com/authenticate', body)
            .then(res => {
                console.log(res);
            })
    }

    get isAuthenticated() {
        return !!this.accessToken;
    }
}
