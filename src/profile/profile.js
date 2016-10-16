'use strict';

import { HttpClient } from 'aurelia-http-client';
import { PlayerProfileService } from '../services/playerprofile';

export class Profile {
    
    static inject = [HttpClient, PlayerProfileService];
    constructor(http, playerProfiles) {
        this.http = http;
        this.playerProfiles = playerProfiles;
    }
    
    activate(params) {
        this.params = params;
        
        let profileProm = this.playerProfiles.get(this.params.playerId)
            .then(playerProfile => {
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
