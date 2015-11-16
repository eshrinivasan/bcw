(function() {
    'use strict'

    angular.module('FinraSolrProvider', [])
        .provider('Solr', function () {
            var defEndpoint = '';
            return {
                setEndpoint: function (url) {
                    defEndpoint = url;
                },
                $get: function ($http) {
                    function Solr(endpoint) {
                        this.search = function (options, keepParamOrder) {
                            var url = endpoint;
                            var defaults = {};
                            angular.extend(defaults, options);
                            var config = {
                                params: defaults,
                                keepParamsOrder: keepParamOrder
                            }
                            console.log(defaults);
                            return $http.jsonp(url, config);
                        };
                        this.withEndpoint = function (url) {

                            return new Solr(url);
                        };
                    }

                    return new Solr(defEndpoint);
                }
            };
        })
        .service('dataShareService', ['$rootScope', function ($rootScope) {
            var service = {};
            service.data = false;
            service.setData = function (data) {
                service.data = data;
                $rootScope.$broadcast('data_shared');
            };
            service.getData = function () {
                return service.data;
            };
            return service;
        }])
        .service('itemShareService', function () {
            var Item = {};
            var queryStr = '';

            return {
                getQueryStr: function () {
                    return queryStr;
                },
                setQueryStr: function () {
                    return queryStr;
                },
                getItem: function () {
                    return Item;
                },
                setItem: function (item) {
                    Item = item;
                }
            };
        })

})()
