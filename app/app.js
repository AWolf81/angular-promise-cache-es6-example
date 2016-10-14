import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uib from 'angular-ui-bootstrap';
import 'highlight.js';
import hljs from 'angular-highlightjs';
import ngPromiseCache from 'angular-promise-cache';

import routes from './routes';
import UserSvcModule from './user.service';
import Components from './components';
import Countdown from './utils/countdown';

import 'bootstrap-css';
import 'highlight-css';
import './styles/custom-corner-badge.scss';
import './styles/main.css';

import noCacheSnippet from './templates/code_snippets/nocache.html';
import cacheSnippet from './templates/code_snippets/cached.html';
        
const moduleName = 'exampleApp';
const ttl = 5000;

class MainController {

    constructor($scope, userSvc, $state, promiseCache) {
        'ngInject';

        this._$scope = $scope;
        this._userSvc = userSvc;
        this._promiseCache = promiseCache;
        this._state = $state;
        this.expirationTime = 0;
        // v0.0.5 Stateful information
        this.expiresAt = 0;
        
        // this.countdown = new Countdown(this.onCountdownTick, 100)
        
        // console.log(this.onCountdownTick, this.countdown);
        // Start the countdown
        // this.countdown.start();
        
        // v0.0.5 Events
        $scope.$on('angular-promise-cache.new', (evt, key, strPromise) => {
            console.log('angular-promise-cache.new', strPromise);
            this.expiresAt = new Date().getTime() + ttl;
        });
        $scope.$on('angular-promise-cache.expired', (evt, key, strPromise) => {
            console.log('angular-promise-cache.expired', key, strPromise);
            this.expiresAt = new Date().getTime() + ttl;
        });
        $scope.$on('angular-promise-cache.active', (evt, key, expirationTime, strPromise) => {
            console.log('angular-promise-cache.active', key, expirationTime, strPromise);
            this.expiresAt = expirationTime;
        });
        $scope.$on('angular-promise-cache.removed', (evt, key) => {
            console.log('angular-promise-cache.removed', key);
            this.expiresAt = 0;
        });

        // ui-router Events
        $scope.$on('$stateChangeSuccess', (evt, toState) => {
            this.title = toState.data.title;
        });

        $scope.$watch(() => {
            return userSvc.getStats();
        }, (stats) => {
            // console.log(stats);
            this.numberOfHttpRequests = stats.httpRequests;
            this.numberOfResolvedPromises = stats.resolvedPromises;
        }, true)
    }

    sendRequest() {
        let curState = this._state.current.name;

        if (curState === 'root.home') {
            // not cached / no countdown needed here
            this._userSvc.getUser(1).then(user => this.user = user);
        }
        else {
            // check if countdown obj. initialized
            this.countdown = this.countdown || new Countdown(this.onCountdownTick.bind(this), 100);
           
            if (!this.countdown.active()) {
                this.countdown.start();
            }
            this._userSvc.getCachedUser(1).then(user => this.user = user);
        }
    }

    onCountdownTick() {
        let now = new Date().getTime();

        // console.log('tick', now, Math.max(0, expiresAt - now));
        this._$scope.$apply(() => 
            this.expirationTime = Math.max(0, this.expiresAt - now)
        );

        // if expired we can stop timer
        if ( now >= this.expiresAt ) {
            this.countdown.stop();
        }
    }

    reset() {
        this.user = {};
        this._userSvc.reset();
    }

    remove() {
        this._promiseCache.remove('example');
    }

    removeAll() {
       this._promiseCache.removeAll(); 
    }

    clearLocalstorage() {
        localStorage.removeItem('example.ls');
    }
}

export default angular.module(moduleName, [
        uib,
        uiRouter,
        hljs,
        ngPromiseCache,

        Components.name,
        UserSvcModule.name
    ])
    .run(($templateCache) => {
        'ngInject';
        
        $templateCache.put('noCacheSnippet.html', noCacheSnippet);
        $templateCache.put('cacheSnippet.html', cacheSnippet);
    })
    .config(routes)
    .controller('mainController', MainController);