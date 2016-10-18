'use strict';

import { HttpClient } from 'aurelia-http-client';
import { StructurePaginator } from '../structure-paginator';
import { PlayerProfileService } from '../services/playerprofile';
import $ from 'jquery';

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
            limit: 6
        });
        
        let structuresProm = this.structurePaginator.contents().then(structures => this.structures = this.structures.concat(structures));
        
        let profileProm = this.playerProfiles.get(params.playerId)
            .then(playerProfile => {
                this.playerProfile = playerProfile;
            });
            
        return Promise.all([profileProm, structuresProm]);
    }
    
    attached() {
        // From http://stackoverflow.com/questions/5059526/infinite-scroll-jquery-plugin
        this.scrollLoad = true;
        $(window).scroll(() => { 
            if (this.scrollLoad && $(window).scrollTop() >= $(document).height() - $(window).height() - 300) {
                this.scrollLoad = false;
                this.structurePaginator.nextPage();
                this.structurePaginator.contents().then(structures => this.structures = this.structures.concat(structures)).then(() => this.scrollLoad = true);
            }
        });
    }
    
}
