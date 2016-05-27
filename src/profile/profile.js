'use strict';

import { HttpClient } from 'aurelia-http-client';

export class Profile {
    
    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }
    
    activate(params) {
        this.params = params;
        
        return this.http.get('/playercache/' + this.params.playerID)
            .then(response => response.content)
            .then((playerProfile) => {
                this.playerProfile = playerProfile;
            });
    }
    
}
