(function() {
    angular.module('listwidget.core')
        .service('dataservice', dataservice)
        .service('itemshareservice', itemshareservice);

    itemshareservice.$inject = [];

    function itemshareservice() {
        var _Item = {};
        var _List = [];
        var _queryStr = '';
        var service = {
            getQueryStr : getQueryStr,
            setQueryStr : setQueryStr,
            getItem : getItem,
            setItem : setItem,
            getList : getList,
            setList : setList
        }
        return service;

            function getQueryStr() {
                return _queryStr;
            }
            function setQueryStr() {
                return _queryStr;
            }
            function getItem() {
                return _Item;
            }
            function setItem(item) {
                _Item = item;
            }
            function getList() {
                return _List;
            }
            function setList(list) {
                _List = list;
            }
     }


    dataservice.$inject = ['$http', '$q', '$log', '$state', 'restConfig'];

    function dataservice($http, $q, $log, $state, restConfig) {

        var _fullName = '';
        var _locations = [];

        var service = {
            searchBy: searchBy,
            capitalize: capitalize,
            getLocations: getLocations,
            getFullName: getFullName,
            concatWords: concatWords
        };

        return service;

        function searchBy(options, keepParamOrder) {
            var deferred = $q.defer();
            var url = restConfig.endpoint;
            var defaults = {};
            angular.extend(defaults, options);
            var config = {
                params: defaults,
                keepParamsOrder: keepParamOrder
            }

            $http.jsonp(url, config).success(
                function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    $state.go('error');
                    $log.error("Couldn't retrieve data, check service end point.");
                });
            return deferred.promise;
        }

        function capitalize(input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }

        function getLocations(item) {

            if (!angular.isUndefined(item.fields.ac_locations) && (item.fields.ac_locations[0]) !== '') {

                var length = item.fields.ac_locations.length;
                var cityState = item.fields.ac_locations[0].split(',');
                if (length > 1) {
                    var leftover = length - 1;
                    _locations = capitalize(cityState[0], true) + ',' + cityState[1] + ' +' + leftover + ' more.';
                }
                else if (length = 1) {
                    _locations = capitalize(cityState[0], true) + ',' + cityState[1];
                }
            }

            return _locations;
        }

        function getFullName(item) {
           _fullName = capitalize(item.fields.ac_firstname + ' ' + item.fields.ac_middlename + ' ' + item.fields.ac_lastname, true);
            return _fullName;

        }

        function concatWords(data) {
            if (!angular.isUndefined(data)) {
                return data.replace(/\s+/g, '+');
            }
            return '';
        }
    }
})()