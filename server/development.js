/* eslint-disable import/no-extraneous-dependencies */
const webpack = require( "webpack" );
const webpackDevMiddleware = require( "webpack-dev-middleware" );
const webpackHotMiddleware = require( "webpack-hot-middleware" );
const webpackConfig = require( "../webpack.config" );
const merge = require( "webpack-merge" );

function loadHotLoadModule( app ) {
    if ( process.env.NODE_ENV !== "production" ) {
        const bundler = webpack( webpackConfig );

        merge( webpackConfig, {
            entry: {
                app: [
                    "webpack-hot-middleware/client",
                    "webpack/hot/only-dev-server",
                ],
            },
            plugins: [ new webpack.HotModuleReplacementPlugin() ],
        } );

        app.use( webpackDevMiddleware( bundler, { noInfo: true } ) );
        app.use( webpackHotMiddleware( bundler, { log: console.log } ) );
    }
}

module.exports = {
    loadHotLoadModule,
};
