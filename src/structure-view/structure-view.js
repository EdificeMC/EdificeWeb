'use strict';

import { HttpClient } from 'aurelia-http-client';
import Clipboard from 'clipboard';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './structure-view.css';
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
        return this.http.get('/structures/' + this.params.id).then((response) => {
            let structure = JSON.parse(response.response);
            this.structure = structure;
            return structure.creatorUUID;
        }).then((creatorUUID) => {
            this.http.get('/playercache/' + creatorUUID).then((playerProfileRes) => {
                this.structure.creatorName = JSON.parse(playerProfileRes.response).name;
            })
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
