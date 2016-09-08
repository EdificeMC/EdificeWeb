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
        return this.http.get('/structures/' + this.params.id)
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
                return this.http.get('/playercache/' + structure.creatorUUID);
            }).then(response => response.content)
            .then((playerProfile) => {
                this.creatorName = playerProfile.name;
            });
    }

    attached() {
        try {
            this.jQCanvas = $('#structure-model');
            const aspectRatio = this.jQCanvas.width() / this.jQCanvas.height();
            this.jQCanvas.get(0).width = this.jQCanvas.parent().width();
            this.jQCanvas.get(0).height = this.jQCanvas.width() / aspectRatio;
            sv(this.jQCanvas.get(0), this.structure, false);
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
            }
        }).then(() => {
            let request = this.http.createRequest('/structures/' + this.params.id)
                .asPut()
                .withContent({
                    name: this.structure.name,
                    screenshot: this.structure.screenshot,
                    modelRendering: renderingDetails
                });
            if(this.auth.isAuthenticated) {
                request = request.withHeader('Authorization', 'Bearer ' + this.auth.accessToken);
            }
            return request.send();
        }).then((response) => {
            console.log(response);
            this.message.status = 'success';
        }).catch(err => {
            this.message.status = 'danger';
            // TODO Give the user some indication of what went wrong
        });

    }

}

function cropImage(canvas) {
    const origImageDataURL = canvas.toDataURL();

    return new Promise(function(resolve, reject) {
        // Draw the structure onto a canvas w/ a 2d context
        let sourceCanvas = document.createElement('CANVAS');
        sourceCanvas.width = canvas.width;
        sourceCanvas.height = canvas.height;
        const sourceCtx = sourceCanvas.getContext('2d');
        let img = new Image();
        img.onload = function() {
            sourceCtx.drawImage(img, 0, 0);
            return resolve(sourceCtx);
        };
        img.src = origImageDataURL;
    }).then(function(sourceCtx) {
        // Determine the bounds of the image for cropping
        const samplingFrequency = 10;
        const backgroundRGBA = [191, 209, 229, 255];
        let leftBound, rightBound, topBound, bottomBound;

        for(let y = 0; y < canvas.height; y += samplingFrequency) {
            for(let x = 0; x < canvas.width; x += samplingFrequency) {
                let pixel = sourceCtx.getImageData(x, y, 1, 1);
                for(let i = 0; i < backgroundRGBA.length; i++) {
                    if(backgroundRGBA[i] !== pixel.data[i]) {
                        leftBound = !leftBound || x < leftBound ? x : leftBound;
                        topBound = !topBound || y < topBound ? y : topBound;
                        rightBound = !rightBound || x > rightBound ? x : rightBound;
                        bottomBound = !bottomBound || y > bottomBound ? y : bottomBound;
                    }
                }
            }
        }

        const padding = 20;
        leftBound -= padding;
        rightBound += padding;
        topBound -= padding;
        bottomBound += padding;

        return new Promise(function(resolve2, reject2) {
            // Draw the cropped image on a new canvas
            const width = rightBound - leftBound;
            const height = bottomBound - topBound;

            let finalCanvas = document.createElement('CANVAS');
            finalCanvas.width = width;
            finalCanvas.height = height;
            const finalCtx = finalCanvas.getContext('2d');

            let finalImg = new Image();
            finalImg.onload = function() {
                finalCtx.drawImage(finalImg, leftBound, topBound, width, height, 0, 0, width, height);
                return resolve2(finalCanvas);
            }
            finalImg.src = origImageDataURL;
        });
    }).then(function(finalCanvas) {
        return finalCanvas.toDataURL();
    });
}
