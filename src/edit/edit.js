'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import { Router } from 'aurelia-router';
import sv, { exportRenderVariables } from 'edifice-structure-viewer';
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
        return this.http.get('/structures/' + this.params.id + '?schematic=true')
            .then(response => response.content)
            .then((structure) => {
                this.structure = structure;
                // Logged in and either owns the structure or is admin
                const userAuthorizedToEdit = this.auth.isAuthenticated && (this.auth.profile.app_metadata.mcuuid === this.structure.creatorUUID || this.auth.profile.app_metadata.roles.includes('admin'));
                if (structure.finalized && !userAuthorizedToEdit) {
                    // TODO navigate to the structure's page
                    // TODO Make a toastr saying not authorized to edit
                    this.router.navigate('/');
                }
                return this.http.get('/playercache/' + structure.author);
            }).then(response => response.content)
            .then((playerProfile) => {
                this.authorName = playerProfile.name;
            });
    }

    attached() {
        try {
            this.jQCanvas = $('#structure-model');
            const aspectRatio = this.jQCanvas.width() / this.jQCanvas.height();
            this.jQCanvas.get(0).width = this.jQCanvas.parent().width();
            this.jQCanvas.get(0).height = this.jQCanvas.width() / aspectRatio;
            sv(this.jQCanvas.get(0), this.structure.schematic, null, false);
        } catch (e) {
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
        const renderingDetails = exportRenderVariables();
        const imgDataPrefix = 'data:image/png;base64,';

        this.http.post('/imgur', {
            image: this.jQCanvas.get(0).toDataURL().substring(imgDataPrefix.length), // Strip away prefixed information for the Imgur API
            type: 'base64'
        }).then(res => res.content)
            .then(res => {
                this.structure.screenshot = {
                    url: res.link,
                    deletehash: res.deletehash
                };
            }).then(() => {
                let request = this.http.createRequest('/structures/' + this.params.id)
                    .asPut()
                    .withContent({
                        name: this.structure.name,
                        screenshot: this.structure.screenshot,
                        modelRendering: renderingDetails
                    });
                if (this.auth.isAuthenticated) {
                    request = request.withHeader('Authorization', 'Bearer ' + this.auth.accessToken);
                }
                return request.send();
            }).then(() => {
                this.message.status = 'success';
            }).catch(() => {
                this.message.status = 'danger';
                // TODO Give the user some indication of what went wrong
            });

    }

}
