'use strict';

export class ImgurValueConverter {
    // Forces https and uses medium size thumbnails
    toView(value) {
        let newVal = value.replace('http:', 'https:');
        newVal = newVal.substring(0, newVal.indexOf('.png')) + 'm' + newVal.substring(newVal.indexOf('.png'));
        return newVal;
    }
}
