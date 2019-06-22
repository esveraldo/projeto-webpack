const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
//TODO Array de plugins
let plugins = [];
// TODO Criando um template dentro de dist, template html
plugins.push(new HtmlWebpack({
    hash: true,
    minify: {
        html: true,
        collapseWhitespace: true,
        removeComments: true
    },
    filename: 'index.html',
    template: __dirname + '/main.html'
}));
// TODO Adiaionando folha de estilo customizada
plugins.push(new extractTextPlugin('custom.css'));

//TODO Incluindo a biblioteca jquery acessivel à todas as suas dependências
plugins.push(new webpack.ProvidePlugin({
    '$': 'jquery/dist/jquery.js',
    'jQuery': 'jquery/dist/jquery.js'
}));
// TODO Dividindo scripts de terceiros e propietarios
plugins.push(
    new webpack.optimize.CommonsChunkPlugin(
        { 
            name: 'vendor', 
            filename: 'vendor.bundle.js'
        }
    )
);

let SERVICE_URL = JSON.stringify('http://localhost:3000');

//TODO Arquivos chamados em produção
if(process.env.NODE_ENV == 'production'){
    // TODO Endereço de produção
    SERVICE_URL = JSON.stringify('http://localhost:3000');
    // TODO Otimizando o bandle
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    // TODO Incluindo o babili
    plugins.push(new babiliPlugin());
    // TODO Minificando css
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        // TODO Printando no terminal
        canPrint: true
     }));
}

plugins.push(new webpack.DefinePlugin({
    SERVICE_URL: SERVICE_URL
}));

module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bandle.js',
        path: path.resolve(__dirname, 'dist'),
        //publicPath: 'dist'
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
    