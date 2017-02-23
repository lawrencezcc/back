var webpack = require('webpack');

var config = {
    entry: './app.jsx',
    output: {
        path: './',
        filename: 'index.js'
    },
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env': {
    //             NODE_ENV: JSON.stringify('production')
    //         }
    //     }),
    //     new webpack.optimize.UglifyJsPlugin(),
    //     new webpack.NoErrorsPlugin()
    // ],

    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                loader: "style-loader!css-loader",
                test: /\.css$/
            },
            {test: /\.json$/, loader: "json-loader"}
        ]
    }
}

module.exports = config;