'use strict';

import { HttpClient } from 'aurelia-http-client';

export class Home {

    structures = [];

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    attached() {
        this.http.get('/structures').then((structureRes) => {
            this.structures = JSON.parse(structureRes.response);
            for (let structure of this.structures) {
                this.http.get('/playercache/' + structure.creatorUUID).then((playerProfileRes) => {
                    console.log(playerProfileRes);
                })
            }
        });
    }

}
