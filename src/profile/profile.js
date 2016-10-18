'use strict';

import { HttpClient } from 'aurelia-http-client';
import { StructurePaginator } from '../structure-paginator';
import { PlayerProfileService } from '../services/playerprofile';

export class Profile {
    
    structures = [];
    
    static inject = [HttpClient, PlayerProfileService];
    constructor(http, playerProfiles) {
        this.http = http;
        this.playerProfiles = playerProfiles;
    }
    
    activate(params) {
        this.structurePaginator = new StructurePaginator(this.http, this.playerProfiles, {
            author: params.playerId,
            limit: 9
        });
        
        let structuresProm = this.structurePaginator.contents().then(structures => this.structures = this.structures.concat(structures));
        
        let profileProm = this.playerProfiles.get(params.playerId)
            .then(playerProfile => {
                this.playerProfile = playerProfile;
            });
            
        return Promise.all([profileProm, structuresProm]);
    }
    
}
