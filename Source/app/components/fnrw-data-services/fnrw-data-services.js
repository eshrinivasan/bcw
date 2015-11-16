(function() {
    'use strict'

    angular.module('FinraDataServices', ['ui.router'])
        .service('dataService', ['$http', '$q', '$log', '$state', function ($http, $q, $log, $state) {

            this.fetchAll = function (url) {
                var deferred = $q.defer();
                $http.jsonp(url, {cache: true}).success(
                    function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $state.go('error');
                        $log.error("Couldn't retrieve data, check service end point.");
                    });
                return deferred.promise;
            }
        }])
        .service('bcString', function () {
            this.capitalize = function (input, all) {
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.replace(reg, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
            }
        })
        .service('bcNameService', function () {
            var fullName = '';

            var capitalize = function (input, all) {
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.replace(reg, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
            }
            return {
                getFullName: function () {
                    return capitalize(fullName, 'all');
                },
                setFullName: function (item) {
                    fullName = item.fields.ac_firstname + ' ' + item.fields.ac_middlename + ' ' + item.fields.ac_lastname;
                }
            };
        })
        .service("urlService", ["$location", function ($location) {
            // reference to service for callbacks
            var __service = this,
                parts = {
                    "queryvars": {}
                },
                absUrl = $location.absUrl(),
            // extract and parse url
                elements = absUrl.split("?");

            parts["queryString"] = elements[1];
            if (elements[1]) {
                parts["hashString"] = (parts["queryString"].split("#"))[1];
                parts["requestParams"] = ((parts["queryString"].split("#"))[0]).split("&");

                parts["requestParams"].forEach(function (queryStringVariable) {
                    var __variable = queryStringVariable.split("=");
                    parts.queryvars[__variable[0]] = __variable[1];
                });
            }
            else {
                $state.go('error');
            }
            // url
            parts["url"] = elements[0];


            // public interface
            // returns variable from query string
            this.getQueryStringVar = function (variable) {
                if (parts.queryvars[variable] !== "undefined") {
                    return parts.queryvars[variable];
                }
                return false;
            };


        }])
        .service("queryStringService", ['$state', function ($state) {

            this.getCRDQueryString = function (crds) {
                var crdString = '';
                if (crds) {
                    //crdString += '+AND+(';
                    angular.forEach(crds, function (value, key) {
                        if (key != 0) {
                            crdString += '+OR+';
                        }
                        crdString += 'ac_current_employ_id:' + value;
                    })
                    return crdString + ')';
                }
                else {
                    $state.go('error');
                    console.error("iFrame parameter must supply at least one CRD number. Returning for all CRDs.");
                }
                return crdString;
            }


        }])
})()