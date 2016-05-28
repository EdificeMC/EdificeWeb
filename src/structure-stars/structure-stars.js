'use strict';

import { HttpClient } from 'aurelia-http-client';

export class StructureStars {

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate(params) {
        this.params = params;
        // Get the structure
        return this.http.get('/structures/' + this.params.id)
            .then((response) => {
                // Get info about its creator
                this.structure = response.content;
                return this.http.get('/playercache/' + this.structure.creatorUUID);
            }).then((playerProfileRes) => {
                this.structure.creatorName = playerProfileRes.content.name;
            }).then(() => {
                // Get the names of all the stargazers
                this.structure.stargazers = this.structure.stargazers.map(stargazerUUID => this.http.get('/playercache/' + stargazerUUID));
                return Promise.all(this.structure.stargazers);
            }).then(stargazerInfos => {
                this.structure.stargazers = stargazerInfos.map(res => res.content);
            });
    }

}
