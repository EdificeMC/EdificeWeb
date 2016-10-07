'use strict';

import { HttpClient } from 'aurelia-http-client';

export class Profile {
    
    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }
    
    activate(params) {
        this.params = params;
        
        let profileProm = this.http.get('/playercache/' + this.params.playerId)
            .then(response => response.content)
            .then((playerProfile) => {
                this.playerProfile = playerProfile;
            });
        let structuresProm = this.http.get('/structures?author=' + this.params.playerId)
            .then(response => response.content)
            .then(structures => {
                this.structures = structures;
            });
        // I am deliberately not getting the names of the creators these structures since this is the profile page
            
        return Promise.all([profileProm, structuresProm]);
    }
    
}
