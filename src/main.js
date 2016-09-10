import {bootstrap} from 'aurelia-bootstrapper-webpack';

bootstrap(function(aurelia) {
    let app = aurelia.use;

    if (ENV === 'development') {
        // Enable Aurelia development debug logs
        app = app.developmentLogging();
    }

    app.standardConfiguration()
        .plugin('aurelia-validation')
        .plugin('aurelia-validatejs')
        .feature('ValidationRenderers/bootstrap-validation');

    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
