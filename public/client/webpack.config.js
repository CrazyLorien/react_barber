const NODE_ENV = process.env.NODE_ENV || 'development',
    webpack = require('webpack'),
    path = require('path');


module.exports = {
    context: path.join(__dirname, "./"),
    entry: [
        "./main.jsx"
    ],
    /*
    несколько точек входа
    enrty: {
      home: "home",
      about: "about",
    }
    */
    output: {
        path: path.join(__dirname, "../javascript"),
        //filename: "bundle.[chunkhash].js" // filename: "[name].js" несколько точек входа
        filename: "bundle.js" // filename: "[name].js" несколько точек входа
            // chunkFilename: "[id].[chunkhash].js"
            // library: "[name]" // глобальные переменные
    },
    /*
    watch: NODE_ENV === 'development',
    watchOptions: {
      aggregateTimeout: 100
    },
    // cdn
    externals: {
      lodash: "_"
    },
    devtool: NODE_ENV === 'development' ? "cheap-inline-module-source-map" : null
    //"cheap-inline-module-source-map" or "eval" in dev, "source-map" in prod
    */
    devtool: '#inline-source-map',
    debug: true,
    module: {
        loaders: [{
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    //exclude: /node_modules/,
                    include: path.join(__dirname, "./"),
                    presets: ["es2015", "react"]
                },
                {
                    test: /\.css$/,
                    use: "style-loader!css-loader"
                },
                {
                    test: /\.(png|jpg?g|gif|svg|ttf|eot|woff|woff2)$/,
                    loaders: [
                        'file?name=[path][name].[ext]?[hash]',
                        //'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    ]
                }
            ]
            // noParse:
    },
    resolve: {
        modulesDirectories: ['client', 'node_modules', './client/node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader'],
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(), // не пересобирать js если возникли ошибки
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(NODE_ENV)
            })
            /*,
                new webpack.optimize.CommonsChunkPlugin({
                  name: "common"
                })*/
        ]
        /*,
          devServer: {
            host: 'localhost',
            port: 3000,
            contentBase: __dirname + '/dist'
          }*/
};

if (NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}