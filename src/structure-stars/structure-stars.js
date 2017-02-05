'use strict';

import { HttpClient } from 'aurelia-http-client';
import { PlayerProfileService } from '../services/playerprofile';

export class StructureStars {

    static inject = [HttpClient, PlayerProfileService];
    constructor(http, playerProfiles) {
        this.http = http;
        this.playerProfiles = playerProfiles;
    }

    async activate(params) {
        this.params = params;

        // Get the structure
        this.structure = (await this.http.get('/structures/' + this.params.id)).content;

        // Get info about its creator
        this.structure.creatorName = (await this.playerProfiles.get(this.structure.author)).name;

        // Get the names of all the stargazers
        this.structure.stargazers = await Promise.all(this.structure.stargazers.map(stargazerUUID => this.playerProfiles.get(stargazerUUID)));
    }

}
