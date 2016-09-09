'use strict';

import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import $ from 'jquery';
import smoothScroll from 'smooth-scroll';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.js';

export class Home {

    structures = [];

    static inject = [HttpClient, EventAggregator, Router];
    constructor(http, eventAggregator, router) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    activate(params) {
        this.params = params;
        
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
        if(this.router.currentInstruction.config.route === 'home') {
           if(this.params.section) {
               // HACK: Without a timeout, the 'team' section goes automatically to download for some reason
               setTimeout(() => {
                   smoothScroll.animateScroll(document.querySelector('#' + this.params.section), null, {
                       speed: 1000,
                       easing: 'easeInOutCubic'
                   }); 
               }, 250);
           }
       }
       
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

        function adjustNavbarCSS() {
            if ($(window).scrollTop() > 80) {
                $(".navbar-brand").css({
                    'margin-top': '0',
                });
                $(".nav.navbar-nav").css({
                    'margin-top': '22px'
                });
                $(".navbar-default").css({
                    'background-color': 'rgba(24, 121, 253, 1)',
                    'transition': 'all 0.3s linear 0s'
                });
                $(".navbar-default").css({
                    'margin-top': '0px'
                });
            } else {
                $(".navbar-brand").css({
                    'margin-top': '30px'
                });
                $(".nav.navbar-nav").css({
                    'margin-top': '52px'
                });
                $(".navbar-default").css({
                    'background-color': 'transparent',
                    'border': '0px solid #ddd'
                });
            }
        }

        adjustNavbarCSS();
        $(window).on('scroll', adjustNavbarCSS);

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
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }]
        });
    }
}
