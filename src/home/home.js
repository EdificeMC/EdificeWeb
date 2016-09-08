'use strict';

import { HttpClient } from 'aurelia-http-client';
import Masonry from 'masonry-layout';
import $ from 'jquery';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.js';

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
    //     let images = document.getElementsByClassName("img-rounded");
    //     let imageLoadPromises = [];
    //     for(let image of images) {
    //         imageLoadPromises.push(new Promise(function(resolve, reject) {
    //             image.onload = function() {
    //                 return resolve();
    //             }
    //         }));
    //     }
    // 
    //     return Promise.all(imageLoadPromises).then(() => {
    //         // Have to wait until all the images are loaded
    //         this.masonry = new Masonry('.grid', {
    //             itemSelector: '.grid-item',
    //             columnWidth: 340 // 320 px for medium Imgur thumbnail + 10 padding + 10 to look better
    //         });
    //     })
    
        $('#for-app-screen').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '#featured-structures-slider'
        });

        $('#featured-structures-slider').slick({
            autoplay: true,
            centerMode: true,
            dots: true,
            arrows: false,
            centerPadding: '60px',
            slidesToShow: 3,
            asNavFor: '#for-app-screen',
            focusOnSelect: true,
            responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                  }
                }
            ]
        });
    }

}
