'use strict';

import { HttpClient } from 'aurelia-http-client';

export class Create {

    imageList;

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate(params) {
        this.params = params;
    }

    attached() {
        console.log(this.http)
        return this.http.get('/structures/' + this.params.id).then((response) => {
            return JSON.parse(response.response);
        }).then((structure) => {
            this.structureName = structure.name;
            return this.http.get('/playercache/' + structure.creatorUUID)
                .then((response) => {
                    return JSON.parse(response.response);
                }).then((playerProfile) => {
                    this.creatorName = playerProfile.name;
                });
        });
    }

    submitStructure() {
        if (!this.imageList) {
            //TODO give some warning about uploading at least 1 photo
            console.warn('no images to upload');
            return;
        }

        let images = [];
        for (var i = 0; i < this.imageList.length; i++) {
            images.push(this.imageList.item(i));
        }

        let imageUploadProm = (imageFile) => {
            return new Promise(function(resolve, reject) {
                try {
                    let img = new Image();
                    img.onload = function onload() {
                        let canvas = document.createElement('CANVAS');
                        let ctx = canvas.getContext('2d');
                        canvas.height = this.height;
                        canvas.width = this.width;
                        ctx.drawImage(this, 0, 0);
                        let imgBase64 = canvas.toDataURL();
                        canvas = null;
                        resolve(imgBase64);
                    }
                    img.src = URL.createObjectURL(imageFile);
                } catch (err) {
                    console.error('Failed to convert image file', err);
                    reject(err);
                }
            }).then((imgBase64) => {
                const imgDataPrefix = 'data:image/png;base64,';
                return this.http.post('/imgur', {
                    image: imgBase64.substring(imgDataPrefix.length), // Strip away prefixed information for the Imgur API
                    type: 'base64'
                })
                .catch(function (err) {
                    console.error('Failed to upload image', err);
                    return Promise.reject(err);
                });
            })
        };

        // Replace each image with a Promise of it being converted and uploaded
        images = images.map(imageUploadProm);

        Promise.all(images).then(function (results) {
            let structureImages = [];
            for(let httpResponse of results) {
                let response = JSON.parse(httpResponse.response);
                structureImages.push({
                    url: response.data.link,
                    deletehash: response.data.deletehash
                });
            }
            return structureImages;
        }).then((structureImages) => {
            this.http.put('/structures/' + this.params.id, {
                name: this.structureName,
                images: structureImages
            })
        });

    }

}
