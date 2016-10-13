import ngPromiseCache from 'angular-promise-cache';

let moduleName = 'exampleApp.services',
    _cnResolvedPromises = 0,
    _cnHttpRequests = 0;

const HTTP = new WeakMap();
const PROMISE_CACHE = new WeakMap();

const ttl = 5000; // caching timeout
const userApi = 'http://jsonplaceholder.typicode.com/users/';

const responseHandler = (result) => {
    _cnResolvedPromises++;
    return result.data;
};

const errorHandler = (err) => {
    _cnResolvedPromises++;
    return err;
}

class UserService {
    constructor($http, promiseCache) {
        HTTP.set(this, $http);
        PROMISE_CACHE.set(this, promiseCache);
        // console.log('user service', promiseCache, $http);
    }

    getUsers() {
        _cnHttpRequests++;
        return HTTP.get(this).get(userApi).then(responseHandler, errorHandler);
    }

    getUser(id) {
        _cnHttpRequests++;
        return HTTP.get(this).get(userApi + id).then(responseHandler, errorHandler);
    }

    getCachedUser(id) {
        let promiseCache = PROMISE_CACHE.get(this);
        
        return promiseCache({
            key: 'example',
            promise:
                () => {
                    _cnHttpRequests++;
                    return HTTP.get(this)
                            .get(userApi + id);
                },
            ttl: ttl,
            // New feature in v0.0.3 - supports forcefully expiring the promise
            // cache on a failure if this function returns true
            expireOnFailure: function(request) {
              return request.status !== 200;
            },
            // New feature in v0.0.5 - local storage support
            localStorageEnabled: true,
            localStorageKey: 'example.ls'
        }).then(responseHandler, errorHandler);
    }

    getStats() {
        return {
            resolvedPromises: _cnResolvedPromises,
            httpRequests: _cnHttpRequests
        };
    }

    reset() {
        _cnHttpRequests = 0;
        _cnResolvedPromises = 0;
    }
    // static userServiceFactory($http) {
    //     return new UserService($http);
    // }
}

// UserService.userServiceFactory.$inject = ['$http'];
// UserService.$inject = ['$http', 'angular-promise-cache'];

export default angular.module(moduleName, [
        ngPromiseCache
    ])
    .service('userSvc', UserService);

// export default moduleName //<<<<<<<< will this also work?