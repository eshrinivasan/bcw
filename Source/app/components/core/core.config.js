(function() {
    'use strict';

    angular.module('listwidget.core')
        .config(configure)
        .run(runApp);

    configure.$inject = ['$urlRouterProvider', '$stateProvider', '$httpProvider', 'ScrollBarsProvider'];
    runApp.$inject = ['$state'];

    function configure($urlRouterProvider, $stateProvider, $httpProvider,ScrollBarsProvider) {



        $urlRouterProvider.otherwise('/');

        var main = {
            name: 'main',
            url: '/',
            abstract: true,
            templateUrl: 'components/list/templates/search.main.html',
            controller: 'SearchController',
            controllerAs: 'searchCtl'
        };
        var list = {
            name: 'list',
            url: '/list',
            parent: 'main',
            templateUrl: 'components/list/templates/list.main.html',
            controller: 'ListController',
            controllerAs: 'listCtl'

        };
        var info = {
            name: 'info',
            parent: 'main',
            url: '',
            templateUrl: 'components/messages/templates/info.messages.html',
            controller: 'MessagesController',
            controllerAs: 'messageCtl'

        }
        var detail = {
            name: 'detail',
            parent: 'main',
            url: '/detail',
            templateUrl: 'components/list/templates/list.detail.html',
            controller: 'ListDetailController',
            controllerAs: 'detailCtl'
        }
        var error = {
            name: 'error',
            parent: 'main',
            url: '/error',
            templateUrl: 'components/messages/templates/error.messages.html',
            controller: 'MessagesController',
            controllerAs: 'messageCtl'
        }
        var disclosure = {
            name: 'disclosure',
            parent: 'main',
            url: '/disclosure',
            templateUrl: 'components/messages/templates/disclosures.messages.html',
            controller: 'MessagesController',
            controllerAs: 'messageCtl'
        }
        var broker = {
            name: 'broker',
            parent: 'main',
            url: '/broker',
            templateUrl: 'components/messages/templates/broker.messages.html',
            controller: 'MessagesController',
            controllerAs: 'messageCtl'
        }
        var ia = {
            name: 'ia',
            parent: 'main',
            url: '/ia',
            templateUrl: 'components/messages/templates/investment-adviser.messages.html',
            controller: 'MessagesController',
            controllerAs: 'messageCtl'
        };




        $stateProvider
            .state(main)
            .state(list)
            .state(info)
            .state(detail)
            .state(error)
            .state(disclosure)
            .state(broker)
            .state(ia);


        $httpProvider.interceptors.push(function () {
            return {
                'request': function (config) {
                    if (!config.keepParamsOrder || !config.params) {
                        return config;
                    }

                    var queryStrings = [];
                    for (var key in config.params) {
                        if (config.params.hasOwnProperty(key)) {
                            queryStrings.push(key + '=' + config.params[key]);
                        }
                    }

                    // Reset the params to be empty
                    config.params = {};

                    config.url += (config.url.indexOf('?') === -1) ? '?' : '&';
                    config.url += queryStrings.join('&');

                    return config;
                }
            };
        })
        ScrollBarsProvider.defaults = {
            scrollButtons: {
                scrollAmount: 'auto', // scroll amount when button pressed
                enable: false // enable scrolling buttons by default
            },
            scrollInertia: 400, // adjust however you want
            axis: 'y',
            theme: 'light',
            autoHideScrollbar: false,
            advanced : {
                updateOnContentResize: true
            }
        };

    }

    function runApp($state) {
        $state.go('info');
    }
})();