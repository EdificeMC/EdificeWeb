'use strict';

import { HttpClient } from 'aurelia-http-client';
import Clipboard from 'clipboard';

export class Home {

    createStructureCmdPrefix = '/edifice create ';
    copiedStructureId = '';
    structures = [];

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate() {
        return this.http.get('/structures')
            .then((structureRes) => {
                this.structures = structureRes.content;
                let playerCacheProms = [];
                for (let structure of this.structures) {
                    playerCacheProms.push(this.http.get('/playercache/' + structure.creatorUUID).then((playerProfileRes) => {
                        structure.creatorName = playerProfileRes.content.name;
                    }));
                }
                return Promise.all(playerCacheProms);
            });
    }

    attached() {
        // Initialize the clipboard
        new Clipboard('#buildStructureBtn').on('success', (e) => {
            this.copiedStructureId = e.text.substring(this.createStructureCmdPrefix.length, e.text.length);
        });
    }

}
