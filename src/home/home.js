'use strict';

import { HttpClient } from 'aurelia-http-client';
import Clipboard from 'clipboard';

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
                    structure.creatorName = JSON.parse(playerProfileRes.response).name;
                })
            }
        });
        // Initialize the clipboard
        new Clipboard('#buildStructureBtn');
    }

}
