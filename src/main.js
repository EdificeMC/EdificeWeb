import {bootstrap} from 'aurelia-bootstrapper-webpack';

// import '../node_modules/bootstrap/dist/css/bootstrap.css';
// import '../node_modules/font-awesome/css/font-awesome.css';

bootstrap(function(aurelia) {
    let urlBase = window.location.hostname;
    if (window.location.hostname === 'localhost') {
        urlBase = 'localhost:3000';
    }
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-auth', (baseConfig) => {
            baseConfig.configure({
                loginUrl: 'http://' + urlBase + '/api/auth',
                responseTokenProp: 'accessToken'
            });
        });
    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
