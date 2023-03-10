const path = require('node:path');

module.exports = env => ({
    entry: './src/index.js',
    output: {
        path: env.mode === 'demo' ? path.resolve('./docs') : path.resolve('./dist'),
        filename: 'main.js',
        library: {
            name: 'MagicTouch',
            type: 'umd',
        },
    },
    mode: 'development',
    devtool: 'inline-source-map',
});
