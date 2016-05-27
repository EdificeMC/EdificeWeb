'use strict';

import { HttpClient } from 'aurelia-http-client';
import Clipboard from 'clipboard';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import $ from 'jquery';

export class StructureView {

    copiedStructureCmd = false;
    createStructureCmdPrefix = '/edifice create ';

    static inject = [HttpClient];
    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    activate(params) {
        this.params = params;
        return this.http.get('/structures/' + this.params.id)
            .then((response) => {
                this.structure = response.content;
                return this.http.get('/playercache/' + this.structure.creatorUUID);
            }).then((playerProfileRes) => {
                this.structure.creatorName = playerProfileRes.content.name;
            });
    }

    attached() {
        // Initialize the clipboard
        new Clipboard('#buildStructureBtn').on('success', (e) => {
            this.copiedStructureCmd = true;
        });
        // Initialize the image carousel
        $('#image-carousel').slick();
    }

}
