var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        app: './src/app/index.js'
    },
    devServer: {
        contentBase: 'build',
        historyApiFallback: true
    },
    output: {
		path: path.resolve(__dirname, "build"),
		// publicPath: "build/", // relative path for github pages
		filename: "bundle.js", // no hash in main.js because index.html is a static page
		chunkFilename: "[hash]/js/[id].js",
		hotUpdateMainFilename: "[hash]/update.json",
		hotUpdateChunkFilename: "[hash]/js/[id].update.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: './src' // PATHS.app
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['ng-annotate', 'babel'], // 'babel-loader' is also a valid name to reference
            },
            {
                test: /\.html$/, // Only .html files
                loader: 'html' // Run html loader
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.es6'],
        modules: ['node_modules', 'src'],
        alias: {
            'bootstrap-css': path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css'),
            'highlight-css': path.resolve(__dirname, 'node_modules/highlight.js/styles/github.css'),
            'corner-ribbon-css': path.resolve(__dirname, './node_modules/corner-ribbon/dist/corner-ribbon.css')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body'
        })
    ]
}