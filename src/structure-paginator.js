'use strict';

export class StructurePaginator {

    allPages = [];
    pageNum = 1;

    constructor(http, options = {}) {
        this.http = http;
        this.options = options;
    }

    pageNumber() {
        return this.pageNum;
    }

    contents() {
        if (this.allPages[this.pageNum]) {
            return this.allPages[this.pageNum].then(data => data.structures);
        }

        this.allPages[this.pageNum] = this.http.get('/structures?' + serialize(this.options))
            .then(res => res.content)
            .then(res => {
                this.options.cursor = res.info.endCursor;
                return res;
            });
            
        return this.allPages[this.pageNum].then(data => data.structures);
    }
    
    hasPreviousPage() {
        if(this.allPages[this.pageNum - 1]) {
            return true;
        }
        return false;
    }
    
    previousPage() {
        this.pageNum--;
    }
    
    hasNextPage() {
        if(this.allPages[this.pageNum + 1]) {
            return Promise.resolve(true);
        }
        
        return this.allPages[this.pageNum].then(data => data.info.moreResults === 'MORE_RESULTS_AFTER_LIMIT');
    }
    
    nextPage() {
        this.pageNum++;
    }

}

function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
}
