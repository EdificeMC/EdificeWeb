'use strict';

const common = require('./webpack.common.config');

module.exports = common({
    'ENV': "'development'",
    'API_URL': "'http://localhost:3000/'"
});
