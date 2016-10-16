'use strict';

import { HttpClient } from 'aurelia-http-client';

export class PlayerProfileService {
    
    cache = {};

    static inject = [HttpClient];
    constructor(http) {
        this.http = http;
    }
    
    get(uuid) {
        if(this.cache[uuid]) {
            return this.cache[uuid];
        }
        
        this.cache[uuid] = this.http.get('/playercache/' + uuid)
            .then(res => res.content);
            
        return this.cache[uuid];
        
    }

}
