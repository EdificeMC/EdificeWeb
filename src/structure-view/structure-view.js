'use strict';

import { HttpClient } from 'aurelia-http-client';
import Chart from 'chart.js';
import moment from 'moment';
import Clipboard from 'clipboard';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import $ from 'jquery';

export class StructureView {

    copiedStructureCmd = false;
    createStructureCmdPrefix = '/edifice create ';

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }

    activate(params) {
        this.params = params;
        let structureProm = this.http.get('/structures/' + this.params.id)
            .then(response => {
                this.structure = response.content;
                return this.http.get('/playercache/' + this.structure.creatorUUID);
            }).then(playerProfileRes => {
                this.structure.creatorName = playerProfileRes.content.name;
            });
        let starsHistoryProm = this.http.get('/stars-history/' + this.params.id)
            .then(response => {
                this.starHistory = response.content;
            }).catch(err => {
                // This project has never been starred before
                this.starHistory = null;
            });
            
        return Promise.all([structureProm, starsHistoryProm]);
    }

    attached() {
        // Initialize the clipboard
        new Clipboard('#buildStructureBtn').on('success', (e) => {
            this.copiedStructureCmd = true;
        });
        // Initialize the image carousel
        $('#image-carousel').slick();

        // SAMPLE DATA
        // this.starHistory = {
        //     structureId: this.structure._id,
        //     month: '5/2016',
        //     values: {
        //         '2016': {
        //             '4': {
        //                 '1': 25,
        //                 '2': 15,
        //                 '3': 37,
        //                 '4': 48,
        //                 '5': 2,
        //                 '6': 25,
        //                 '7': 36,
        //                 '8': 34,
        //                 '9': 15,
        //                 '10': 12,
        //                 '11': 47,
        //                 '12': 112
        //             }
        //         }
        //     }
        // }
        if(this.starHistory) {
            let labels = [];
            let data = [];
            for(let year in this.starHistory.values) {
                for(let month in this.starHistory.values[year]) {
                    for(let day in this.starHistory.values[year][month]) {
                        let date = new Date(parseInt(year), parseInt(month), parseInt(day));
                        date = moment(date);
                        labels.push(date);
                        data.push(this.starHistory.values[year][month][day]);
                    }
                }
            }
            let element = $('#structure-stats');
            let chart = new Chart(element, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: "Stars",
                        data,
                        backgroundColor: '#D4AF37'
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: "time",
                            stacked: true
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }

}
