import {bootstrap} from 'aurelia-bootstrapper-webpack';

bootstrap(function(aurelia) {
    let urlBase = window.location.hostname;
    if (window.location.hostname === 'localhost') {
        urlBase = 'localhost:3000';
    }
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-validation')
        .plugin('aurelia-validatejs')
        .feature('ValidationRenderers/bootstrap-validation');
        
    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
