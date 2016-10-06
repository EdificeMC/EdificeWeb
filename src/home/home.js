'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import $ from 'jquery';
import smoothScroll from 'smooth-scroll';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.js';

export class Home {

    structures = [];

    static inject = [HttpClient, EventAggregator, Router, AuthService];
    constructor(http, eventAggregator, router, auth) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.auth = auth;
    }

    activate(params) {
        this.params = params;

        return this.http.get('/structures')
            .then((structureRes) => {
                this.structures = structureRes.content;
                let playerCacheProms = [];
                for (let structure of this.structures) {
                    playerCacheProms.push(this.http.get('/playercache/' + structure.author).then((playerProfileRes) => {
                        structure.authorName = playerProfileRes.content.name;
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

        function adjustNavbarCSS() {
            if ($(window).scrollTop() > 80) {
                $('.navbar-default').removeClass('navbar-transparent');
            } else {
                $('.navbar-default').addClass('navbar-transparent');
            }
        }

        adjustNavbarCSS();
        $(window).on('scroll', adjustNavbarCSS);

        $('#featured-structures-slider').slick({
            autoplay: true,
            centerMode: true,
            dots: true,
            arrows: false,
            centerPadding: '60px',
            slidesToShow: 3,
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

    detached() {
        // Stop listening for scrolling - only for the home page
        $(window).off('scroll');
        // Remove the transparent navbar class
        $('.navbar-default').removeClass('navbar-transparent');
    }
}
