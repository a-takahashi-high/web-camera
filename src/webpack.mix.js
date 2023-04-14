const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/ts/app.ts', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .options({
        hmrOptions: {
            host: '49.212.187.208',
            port: 8000 // Can't use 443 here because address already in use
        }
     });
