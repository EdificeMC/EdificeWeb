'use strict';

import { HttpClient } from 'aurelia-http-client';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './structure-view.css';
import $ from 'jquery';

export class StructureView {

    static inject = [HttpClient];
    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    activate(params) {
        this.params = params;
    }

    attached() {
        this.message = {};
        return this.http.get('/structures/' + this.params.id).then((response) => {
            return JSON.parse(response.response);
        }).then((structure) => {
            this.structure = structure;
        }).then(() => {
            $('#image-carousel').slick();
        });
    }

}
