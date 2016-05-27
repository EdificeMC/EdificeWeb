'use strict';

import { HttpClient } from 'aurelia-http-client';

export class Profile {
    
    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }
    
    activate(params) {
        this.params = params;
        
        let profileProm = this.http.get('/playercache/' + this.params.playerID)
            .then(response => response.content)
            .then((playerProfile) => {
                this.playerProfile = playerProfile;
            });
        let structuresProm = this.http.get('/structures?creatorUUID=' + this.params.playerID)
            .then(response => response.content)
            .then(structures => {
                this.structures = structures;
            })
            
        return Promise.all([profileProm]);
    }
    
}
