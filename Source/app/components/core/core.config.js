(function() {
    'use strict';

    angular.module('listwidget.core')
        .config(configure)
        .run(runApp);

    configure.$inject = ['$urlRouterProvider', '$stateProvider', '$httpProvider','iScrollServiceProvider'];
    runApp.$inject = ['$state'];

    function configure($urlRouterProvider, $stateProvider, $httpProvider, iScrollServiceProvider) {



        $urlRouterProvider.otherwise('/');

        var main = {
            name: 'main',
            url: '/',
            abstract: true,
            templateUrl: 'components/list/templates/search.main.html',
            controller: 'SearchController',
            controllerAs: 'vm'
        };
        var list = {
            name: 'list',
            url: '/list',
            parent: 'main',
            templateUrl: 'components/list/templates/list.main.html',
            controller: 'ListController',
            controllerAs: 'vm'

        };
        var info = {
            name: 'info',
            parent: 'main',
            url: '',
            templateUrl: 'components/messages/templates/info.messages.html',
            controller: 'MessagesController',
            controllerAs: 'vm'

        }
        var detail = {
            name: 'detail',
            parent: 'main',
            url: '/detail',
            templateUrl: 'components/list/templates/list.detail.html',
            controller: 'ListDetailController',
            controllerAs: 'vm'
        }
        var error = {
            name: 'error',
            parent: 'main',
            url: '/error',
            templateUrl: 'components/messages/templates/error.messages.html',
            controller: 'MessagesController',
            controllerAs: 'vm'
        };


        var options = {
            iScroll: {
                mousewheel: true,
                scrollbars: 'custom',
                scrollY: true,
                scrollX: false,
                tap: true,
                fadeScrollbars : false,
                keyBindings : true,
                momentum: false,
                snap: true,
                zoom:true,
                bindToWrapper: true,
                onBeforeScrollStart: function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null
            }
        }

        iScrollServiceProvider.configureDefaults(options);

        $stateProvider
            .state(main)
            .state(list)
            .state(info)
            .state(detail)
            .state(error);


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

    }

    function runApp($state) {
        $state.go('info');
    }
})();