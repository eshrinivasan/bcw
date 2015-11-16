(function() {
    'use strict';

    angular.module('BCWidgetApp', ['FinraDataServices', 'FinraSolrProvider', 'BCWidgetApp.list',
        'BCWidgetApp.message', 'ui.router', 'ngAnimate'])

        .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 'SolrProvider', function ($urlRouterProvider, $stateProvider, $httpProvider, SolrProvider) {
            SolrProvider.setEndpoint('http://doppler.qa.finra.org/doppler-lookup/api/v1/lookup');

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

        .controller('BCWidgetCtrl', ['$scope', '$state', 'dataService', 'Solr', 'dataShareService', 'urlService', 'queryStringService', function ($scope, $state, dataService, Solr, dataShareService, urlService, queryStringService) {

            //Set up initial view.
            $state.go('message');

            $scope.getViewState = function () {
                if ($state.current.name == 'list') {
                    return 'slideInLeft';
                }
                else {
                    return 'slideInRight';
                }

            }

            var crd_numbers = urlService.getQueryStringVar('crds').split(',');
            var startAt = 0;

            $scope.loadMoreData = function (increment) {
                $scope.startAt += increment;
                this.search($scope.model.query);
            }

            var concatWords = function (data) {
                if (data) {
                    return data.replace(/\s+/g, '+');
                }
                return false;
            }

            var getFirstWord = function (data) {

                if (data) {
                    var first = data.split(' ');
                    return first[0];
                }
                return false;
            }
            $scope.search = function (data) {

                if (data.length == 0) {
                    $state.go("message");
                }
                else {
                    $state.go('list');
                    var concatenated = concatWords(data);
                    var firstWord = getFirstWord(data);
                    var params = {
                        'json.wrf': 'JSON_CALLBACK',
                        start: 0,
                        results: 20,
                        sources: 'BC_INDIVIDUALS_WG',
                        hl: false,
                        query: concatenated,
                        filter: '(ac_ia_active_fl:Y+OR+ac_bc_active_fl:Y)' + '+AND+(' + queryStringService.getCRDQueryString(crd_numbers),
                        wt: 'json'

                    };

                    Solr.search(params, true)
                        .then(function (data) {
                            $scope.results = data.data.results.BC_INDIVIDUALS_WG.results;

                        }), function (error) {

                        console.error(error)
                    };


                }
            }
        }]);

})()