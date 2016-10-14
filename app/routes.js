import rootTmpl from './templates/partials/layout.html';
import homeTmpl from './templates/partials/home.html';
import cachedExampleTmpl from './templates/partials/cachedExample.html';

const config = function($stateProvider, $urlRouterProvider, $locationProvider) {
    'ngInject';

    let states = [
        {
            name: 'root',
            url: '/',
            abstract: true,
            template: rootTmpl
        },
        {
            name: 'root.home',
            data: {
                title: 'Simple XHR Request (no caching)'
            },
            url: '',
            views: {
                'code': {
                    // template cache loaded in run see app.js
                    // template cache needed for correct encoding of => in snippet
                    template: '<div hljs hljs-include="\'noCacheSnippet.html\'"></div>'
                },
                'output': {
                    template: homeTmpl 
                }
            }
        },
        {
            name: 'root.example',
            url: 'example/',
            data: {
                title: 'Simple XHR Request (with caching)'
            },
            views: {
                'code': {
                    template: '<div hljs hljs-include="\'cacheSnippet.html\'"></div>'
                },
                'output': {
                    template: cachedExampleTmpl
                }
            }
        }
    ];
    
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    // add states to state provider

    for( let state of states ) {
        $stateProvider.state(state);
    }
};

export default config;