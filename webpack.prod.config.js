'use strict';

const common = require('./webpack.common.config');

module.exports = common({
    'ENV': "'production'",
    'API_URL': "'https://api.edificemc.com/'"
});
