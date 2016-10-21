'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PlayerProfileService } from '../services/playerprofile.js';
import { Router } from 'aurelia-router';
import { StructurePaginator } from '../structure-paginator';
import $ from 'jquery';
import smoothScroll from 'smooth-scroll';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.js';

const featuredStructureIds = ['ciu0k36g40008agl0a1oxwuna', 'ciu0k8ah00009agl02naz1euj', 'ciuen5ujk0001wxl03opjuw44', 'ciuen8hbw0002wxl0xwv6ank3', 'ciuenggm60004wxl0fjq7d7e5', 'ciuenjmn00005wxl03bcrdwcx', 'ciuhgfe7c0000oal0s4qn7d5u'];

export class Home {

    featuredStructures = [];
    structures = [];

    static inject = [HttpClient, EventAggregator, Router, AuthService, PlayerProfileService];
    constructor(http, eventAggregator, router, auth, playerProfiles) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.auth = auth;
        this.playerProfiles = playerProfiles;
    }

    activate(params) {
        this.params = params;

        this.structurePaginator = new StructurePaginator(this.http, this.playerProfiles, {
            limit: 8
        });

        const structurePaginatorProm = this.structurePaginator.contents().then(structures => this.updatePaginationContents(structures));

        const featuredStructuresProm = featuredStructureIds.map(id =>
            this.http.get(`/structures/${id}`)
            .then(structureRes => {
                const structure = structureRes.content;
                this.featuredStructures.push(structure);
                return this.playerProfiles.get(structure.author).then(profile => structure.authorName = profile.name);
            }));
            
        return Promise.all([structurePaginatorProm, Promise.all(featuredStructuresProm)]);
    }

    previousPage() {
        this.structurePaginator.previousPage();
        const previousPageProm = this.structurePaginator.contents();

        $('#explore-structures').animateCSS('fadeOut', () => {
            previousPageProm
                .then(structures => this.updatePaginationContents(structures))
                .then(() => $('#explore-structures').animateCSS('fadeIn'));
        });
    }

    nextPage() {
        this.structurePaginator.nextPage();
        const nextPageProm = this.structurePaginator.contents();

        $('#explore-structures').animateCSS('fadeOut', () => {
            nextPageProm
                .then(structures => this.updatePaginationContents(structures))
                .then(() => $('#explore-structures').animateCSS('fadeIn'));
        });
    }

    updatePaginationContents(structures) {
        this.currentPageStructures = structures;
        this.hasPreviousPage = this.structurePaginator.hasPreviousPage();
        this.currentPage = this.structurePaginator.pageNumber();
        return this.structurePaginator.hasNextPage().then(nextPage => this.hasNextPage = nextPage);
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
