'use strict';

import { HttpClient } from 'aurelia-http-client';
import { PlayerProfileService } from '../services/playerprofile';

export class StructureStars {

    static inject = [HttpClient, PlayerProfileService];
    constructor(http, playerProfiles) {
        this.http = http;
        this.playerProfiles = playerProfiles;
    }

    activate(params) {
        this.params = params;
        // Get the structure
        return this.http.get('/structures/' + this.params.id)
            .then((response) => {
                // Get info about its creator
                this.structure = response.content;
                return this.playerProfiles.get(this.structure.author);
            }).then((playerProfileRes) => {
                this.structure.creatorName = playerProfileRes.name;
            }).then(() => {
                // Get the names of all the stargazers
                this.structure.stargazers = this.structure.stargazers.map(stargazerUUID => this.playerProfiles.get(stargazerUUID));
                return Promise.all(this.structure.stargazers);
            }).then(stargazerInfos => this.structure.stargazers = stargazerInfos);
    }

}
