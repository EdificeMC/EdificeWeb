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
        };

        return this.http.post('/auth', body)
            .then(res => res.content)
            .then(data => {
                this.accessToken = data.accessToken;
                this.profile = data.selectedProfile;
                return this.profile;
            });
    }

    get isAuthenticated() {
        return !!this.accessToken;
    }
}
