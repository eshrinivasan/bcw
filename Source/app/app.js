(function() {
    'use strict';

    angular.module('BCWidgetApp', ['FinraDataServices', 'BCWidgetApp.list',
        'BCWidgetApp.message', 'ui.router', 'ngAnimate'])

        .constant('restConfig', { endpoint: 'http://doppler.qa.finra.org/doppler-lookup/api/v1/lookup'})
        .config(['$urlRouterProvider', '$stateProvider', '$httpProvider',  function ($urlRouterProvider, $stateProvider, $httpProvider) {

            $urlRouterProvider.otherwise('/');

            var main = {
                name: 'main',
                url: '/',
                templateUrl: 'components/fnrw-bcw-search/bcw.main.html',
                controller: 'BCWidgetCtrl',
                resolve: {}
            };
            var list = {
                name: 'list',
                url: '/list',
                parent: 'main',
                templateUrl: 'components/fnrw-bcw-search/bcw.main.list.html',
                controller: 'SolrSearchCtrl'

            };

            var message = {
                name: 'message',
                parent: 'main',
                url: '/message',
                templateUrl: 'components/fnrw-bcw-message/bcw.main.message.html',
                controller: 'MessageCtrl'

            }
            var detail = {
                name: 'detail',
                parent: 'main',
                url: '/detail',
                templateUrl: 'components/fnrw-bcw-search/bcw.list.detail.html',
                controller: 'ItemDetailCtrl'
            }
            var error = {
                name: 'error',
                parent: 'main',
                url: '/error',
                templateUrl: 'components/fnrw-bcw-message/bcw.main.message.error.html',
                controller: 'ErrorMessageCtrl'
            }
            $stateProvider
                .state(main)
                .state(message)
                .state(list)
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
            });

        }])

        .controller('BCWidgetCtrl', ['$scope', '$state', 'dataService', 'urlService', 'queryStringService', 'restConfig', function ($scope, $state, dataService, urlService, queryStringService, restConfig) {

            //Set up initial view.
            $state.go('message');
            $scope.results = [];

            $scope.getViewState = function () {
                if ($state.current.name == 'list') {
                    return 'slideInLeft';
                }
                else {
                    return 'slideInRight';
                }

            }

            if (urlService.getQueryStringVar('crds')) {
                var crd_numbers = urlService.getQueryStringVar('crds').split(',');
            }
            var startAt = 0;


            var concatWords = function (data) {
                if (data) {
                    return data.replace(/\s+/g, '+');
                }
                return false;
            }

             $scope.search = function (data) {

                 var lastIndex = 0;


                 if (data.length === 0) {
                     $state.go("message");
                 }
                 else {
                     $state.go('list');
                     var params = {
                         'json.wrf': 'JSON_CALLBACK',
                         start: startAt,
                         results: 20,
                         sources: 'BC_INDIVIDUALS_2210',
                         hl: false,
                         query: concatWords(data),
                         filter: '(ac_ia_active_fl:Y+OR+ac_bc_active_fl:Y)' + queryStringService.getCRDQueryString(crd_numbers),
                         wt: 'json'

                     };

                     dataService.search(restConfig.endpoint, params, true)
                         .then(function (data) {
                             console.log(data);
                             $scope.results = data.results.BC_INDIVIDUALS_2210.results;


                         }), function (error) {

                         console.error(error)
                     };


                 }
             }


        }]);

})()