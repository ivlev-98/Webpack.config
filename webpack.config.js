const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets'
}

const PAGES = fs.readdirSync(`${PATHS.src}/pug/pages/`).filter(fileName => fileName.endsWith('.pug'))

let config = {
    entry: {
        app: PATHS.src
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        static: PATHS.dist,
        port: 5000,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug3-loader',
                options: {
                  pretty: true
                },
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        }
                    },
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'},
                    {loader: 'stylus-loader'}
                ]
            },
            {
                test: /\.(png|jpg|jpeg|svg|webp|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `${PATHS.assets}/img/[name].[contenthash][ext]`
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `${PATHS.assets}/fonts/[name].[contenthash][ext]`
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.ts', '.styl' ]
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        clean: true,
        path: PATHS.dist,
        publicPath: '/'
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: '[id].css'
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PATHS.src}/pug/pages/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`,
            minify: {
                removeRedundantAttributes: false
            }
          }))
    ]
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.module.rules[2].use.unshift({
            loader: 'style-loader',
            options: {
                esModule: false
            },
        });
    }

    if(process.env.WEBPACK_SERVE) {
        config.devtool = 'inline-source-map';
        config.output.clean = false;
        config.module.rules[3].generator = {filename: `${PATHS.assets}/img/[name][ext]`};
        config.module.rules[4].generator = {filename: `${PATHS.assets}/fonts/[name][ext]`};
        config.plugins[0] = new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        });
    }

    return config;
};
