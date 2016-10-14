import tmpl from './navbar.html';

const navbar = {
    template: tmpl,
    controller: function() {
        this.navCollapse = false;
    },
    controllerAs: 'navCtrl'
};

export default navbar;