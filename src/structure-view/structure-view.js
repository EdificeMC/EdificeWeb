'use strict';

import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../services/auth';
import Chart from 'chart.js';
import moment from 'moment';
import Clipboard from 'clipboard';
import toastr from 'toastr';
import $ from 'jquery';
import sv from 'edifice-structure-viewer';

export class StructureView {

    copiedStructureCmd = false;
    createStructureCmdPrefix = '/edifice create ';

    static inject = [HttpClient, AuthService];
    constructor(http, auth) {
        this.http = http;
        this.auth = auth;
    }

    activate(params) {
        this.params = params;
        return this.http.get(`/structures/${this.params.id}`)
            .then(response => {
                this.structure = response.content;
                // Logged in and either owns the structure or is admin
                this.authorizedToEdit = this.auth.isAuthenticated && (this.auth.profile.app_metadata.mcuuid === this.structure.creatorUUID || this.auth.profile.app_metadata.roles.includes('admin'));
                return this.http.get('/playercache/' + this.structure.creatorUUID);
            }).then(playerProfileRes => {
                this.structure.creatorName = playerProfileRes.content.name;
            });
        // let starsHistoryProm = this.http.get('/stats/' + this.params.id)
        //     .then(response => {
        //         this.starHistory = response.content;
        //     }).catch(err => {
        //         // This project has never been starred before
        //         this.starHistory = null;
        //     });
    }

    attached() {
        try {
            let canvas = $('#structure-model');
            const aspectRatio = canvas.width() / canvas.height();
            canvas.get(0).width = canvas.parent().width();
            canvas.get(0).height = canvas.width() / aspectRatio;
            sv(canvas.get(0), this.structure, true);
        } catch(e) {
            toastr.error('This page requires WebGL. Click here to find out more.', 'WebGL', {
                timeOut: -1,
                extendedTimeOut: -1,
                onclick: function() {
                    window.location.href = 'https://get.webgl.org/';
                }
            });
        }
        // Initialize the clipboard
        new Clipboard('#buildStructureBtn').on('success', (e) => {
            this.copiedStructureCmd = true;
        });

        // SAMPLE DATA
        // this.starHistory = {
        //     id : "5760cee643cf78b00e557cb3",
        //     structureId : "572df96ff989ea7e559c217d",
        //     values : {
        //         "2016" : {
        //             "5" : {
        //                 "14" : {
        //                     "views" : 5
        //                 },
        //                 "15" : {
        //                     "views" : 6,
        //                     "stars" : 1
        //                 },
        //                 "16": {
        //                     "stars": 5,
        //                     "views": 10
        //                 }
        //             }
        //         }
        //     }
        // }
        // if(!this.starHistory) {
        //     // Never been starred or viewed before, although that shouldn't be possible since the client just viewed this page...
        //     return;
        // }
        //
        // let labels = []; // List of dates
        // let data = {
        //     stars: [],
        //     views: []
        // };
        // for(let year in this.starHistory.values) {
        //     for(let month in this.starHistory.values[year]) {
        //         for(let day in this.starHistory.values[year][month]) {
        //             let date = new Date(parseInt(year), parseInt(month), parseInt(day));
        //             date = moment(date);
        //             labels.push(date);
        //             for(let dataset of Object.keys(data)) {
        //                 // It doesn't matter whether the value exists or not because there needs to be at least
        //                 // the placeholder undefined for the chart to stay aligned
        //                 data[dataset].push(this.starHistory.values[year][month][day][dataset]);
        //             }
        //         }
        //     }
        // }
        // let element = $('#structure-stats');
        // let chart = new Chart(element, {
        //     type: 'line',
        //     data: {
        //         labels,
        //         datasets: [{
        //             label: 'Stars',
        //             data: data.stars,
        //             backgroundColor: '#D4AF37'
        //         }, {
        //             label: 'Views',
        //             data: data.views,
        //             backgroundColor: 'rgba(75,192,192,0.4)'
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             xAxes: [{
        //                 type: "time",
        //                 stacked: true
        //             }],
        //             yAxes: [{
        //                 ticks: {
        //                     beginAtZero: true
        //                 }
        //             }]
        //         }
        //     }
        // });
    }

}
