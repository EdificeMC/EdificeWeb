'use strict';

import { HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router';
import sv from 'edifice-structure-viewer';
import $ from 'jquery';

export class Create {

    message = {};
    imageList;

    static inject = [HttpClient, Router];
    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    activate(params) {
        this.params = params;
        return this.http.get('/structures/' + this.params.id)
            .then(response => response.content)
            .then((structure) => {
                // Check if the structure is already finalized, and if so, redirect to home
                if (structure.finalized) {
                    // TODO navigate to the structure's page
                    this.router.navigate('/');
                }
                this.structure = structure;
                return this.http.get('/playercache/' + structure.creatorUUID);
            }).then(response => response.content)
            .then((playerProfile) => {
                this.creatorName = playerProfile.name;
            });
    }
    
    attached() {
        this.canvas = $('#structure-model');
        const aspectRatio = this.canvas.width() / this.canvas.height();
        this.canvas.get(0).width = this.canvas.parent().width();
        this.canvas.get(0).height = this.canvas.width() / aspectRatio;
        sv(this.canvas.get(0), this.structure, false);
    }

    submitStructure() {
        // Spinning loading animation...
        this.message.status = 'loading';
        this.message.text = '';
        
        const imgBase64 = this.canvas.get(0).toDataURL();
        const imgDataPrefix = 'data:image/png;base64,';
        this.http.post('/imgur', {
            image: imgBase64.substring(imgDataPrefix.length), // Strip away prefixed information for the Imgur API
            type: 'base64'
        }).then(res => res.content)
        .then(res => {
            this.structure.screenshot = {
                url: res.link,
                deletehash: res.deletehash
            }
        }).then(() => {
            return this.http.put('/structures/' + this.params.id, {
                name: this.structure.name,
                screenshot: this.structure.screenshot
            })
        }).then((response) => {
            this.message.status = 'success';
        });

    }

}
