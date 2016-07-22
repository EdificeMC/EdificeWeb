'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import { Router } from 'aurelia-router';
import sv from 'edifice-structure-viewer';
import toastr from 'toastr';
import $ from 'jquery';

export class Edit {

    message = {};
    imageList;

    static inject = [HttpClient, Router, AuthService];
    constructor(http, router, auth) {
        this.http = http;
        this.router = router;
        this.auth = auth;
    }

    activate(params) {
        this.params = params;
        return this.http.get('/structures/' + this.params.id)
            .then(response => response.content)
            .then((structure) => {
                // Check if the structure is already finalized and if the user owns the structure they are trying to edit
                const userAuthorizedToEdit = this.auth.isAuthenticated && this.auth.profile.app_metadata.mcuuid === structure.creatorUUID;
                if (structure.finalized && !userAuthorizedToEdit) {
                    // TODO navigate to the structure's page
                    // TODO Make a toastr saying not authorized to edit
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
        try {
            this.canvas = $('#structure-model');
            const aspectRatio = this.canvas.width() / this.canvas.height();
            this.canvas.get(0).width = this.canvas.parent().width();
            this.canvas.get(0).height = this.canvas.width() / aspectRatio;
            sv(this.canvas.get(0), this.structure, false);
        } catch(e) {
            toastr.error('This page requires WebGL. Click here to find out more.', 'WebGL', {
                timeOut: -1,
                extendedTimeOut: -1,
                onclick: function() {
                    window.location.href = 'https://get.webgl.org/';
                }
            });
        }
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
            let request = this.http.createRequest('/structures/' + this.params.id)
                .asPut()
                .withContent({
                    name: this.structure.name,
                    screenshot: this.structure.screenshot
                });
            if(this.auth.isAuthenticated) {
                request = request.withHeader('Authorization', 'Bearer ' + this.auth.accessToken);
            }
            return request.send();
        }).then((response) => {
            this.message.status = 'success';
        }).catch(err => {
            this.message.status = 'danger';
            // TODO Give the user some indication of what went wrong
        });

    }

}
