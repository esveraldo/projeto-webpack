const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

let plugins = [];

plugins.push(new extractTextPlugin('custom.css'));

plugins.push(new webpack.ProvidePlugin({
    '$': 'jquery/dist/jquery.js',
    'jQuery': 'jquery/dist/jquery.js'
}));

if(process.env.NODE_ENV == 'production'){
    plugins.push(new babiliPlugin());
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        canPrint: true
     }));
}

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bandle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/, 
                    //loader: 'style-loader!css-loader' 
                    use: extractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },
                { 
                    test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, 
                    loader: 'file-loader' 
                }
            ]
        },
        plugins: plugins
    }
    