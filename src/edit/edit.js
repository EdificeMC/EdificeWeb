'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import { PlayerProfileService } from '../services/playerprofile';
import { Router } from 'aurelia-router';
import sv, { exportRenderVariables } from 'edifice-structure-viewer';
import toastr from 'toastr';
import $ from 'jquery';

export class Edit {

    message = {};
    imageList;

    static inject = [HttpClient, Router, AuthService, PlayerProfileService];
    constructor(http, router, auth, playerProfiles) {
        this.http = http;
        this.router = router;
        this.auth = auth;
        this.playerProfiles = playerProfiles;
    }

    async activate(params) {
        this.params = params;

        this.structure = (await this.http.get('/structures/' + this.params.id + '?schematic=true')).content;

        // Logged in and either owns the structure or is admin
        const userAuthorizedToEdit = this.auth.isAuthenticated && (this.auth.profile.app_metadata.mcuuid === this.structure.creatorUUID || this.auth.profile.app_metadata.roles.includes('admin'));
        if (this.structure.finalized && !userAuthorizedToEdit) {
            // TODO navigate to the structure's page
            // TODO Make a toastr saying not authorized to edit
            this.router.navigate('/');
        }

        this.authorName = (await this.playerProfiles.get(this.structure.author)).name;
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

    async submitStructure() {
        try {
            // Spinning loading animation...
            this.message.status = 'loading';
            this.message.text = '';
            const renderingDetails = exportRenderVariables();
            const imgDataPrefix = 'data:image/png;base64,';

            const imgurRes = (await this.http.post('/imgur', {
                image: this.jQCanvas.get(0).toDataURL().substring(imgDataPrefix.length), // Strip away prefixed information for the Imgur API
                type: 'base64'
            })).content;

            this.structure.screenshot = {
                url: imgurRes.link,
                deletehash: imgurRes.deletehash
            };

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
            await request.send();

            this.message.status = 'success';
        } catch(err) {
            this.message.status = 'danger';
            // TODO Give the user some indication of what went wrong
        }
    }

}
