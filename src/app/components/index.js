import angular from 'angular';

import Navbar from './navbar/component';

export default angular.module('exampleApp.components', [])
    .component('navbar', Navbar);