'use strict';

import { HttpClient } from 'aurelia-http-client';
import Masonry from 'masonry-layout';
import $ from 'jquery';

export class Home {

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
        $(window).on('load', () => {
            // Have to wait until all the images are loaded
            this.masonry = new Masonry('.grid', {
                itemSelector: '.grid-item',
                columnWidth: 340 // 320 px for medium Imgur thumbnail + 10 padding + 10 to look better
            });
        })
    }

}
