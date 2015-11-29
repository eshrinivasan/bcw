(function() {
    angular.module('bc2210', ['listwidget.core', 'listwidget.list', 'listwidget.messages']);
})();(function() {
    'use strict';

    angular.module('listwidget.core')
        .config(configure)
        .run(runApp);

    configure.$inject = ['$urlRouterProvider', '$stateProvider', '$httpProvider'];
    runApp.$inject = ['$state'];

    function configure($urlRouterProvider, $stateProvider, $httpProvider) {

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
        }

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
        });
    };

    function runApp($state) {
        $state.go('info');
    }
})();;(function() {
    angular.module('listwidget.core')
        .constant('restConfig', { endpoint: 'http://doppler.finra.org/doppler-lookup/api/v1/lookup' })
        .constant('externalUrls',
                { bcIndUrl : 'http://brokercheck.finra.org/Individual/Summary/',
                  iaIndUrl : 'http://www.adviserinfo.sec.gov/IAPD/Support/IAPD_Summary_Link.aspx?Source=Widget&IndividualID='})
        .constant('tooltips',
                { broker: "A broker, or registered representative, is a person who buys and sells securities—such as stocks, bonds or mutual funds—for a customer or for a securities firm.",
                  investmentAdvisor: 'An investment adviser is an individual or company that is paid for providing advice about investments to their clients.',
                  disclosure: 'All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, ' +
                              'regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.'})
})();(function() {
    angular.module('listwidget.core')
        .factory('urlfactory', urlfactory);

    urlfactory.$inject = ['$location'];

    function urlfactory($location) {
        // reference to service for callbacks
        var __service = this,
            parts = {
                "queryvars": {}
            },
            absUrl = $location.absUrl(),
        // extract and parse url
            elements = absUrl.split("?");


        if (!angular.isUndefined(elements) && elements.length > 1) {
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
               // $state.go('error');
            }
            // url
            parts["url"] = elements[0];
        }

        var service = {
            getQueryStringVar : getQueryStringVar,
            createQueryStringEle : createQueryStringEle
        }
        return service;

        function getQueryStringVar(variable) {

            if (parts.queryvars[variable] !== "undefined") {
                console.log('am i here');
                return parts.queryvars[variable];
            }
            return false;
        }

        function createQueryStringEle(crds) {

                var crdString = '';
                if (!angular.isUndefined(crds)) {
                    crdString += '+AND+(';
                    angular.forEach(crds, function (value, key) {
                        if (key != 0) {
                            crdString += '+OR+';
                        }
                        crdString += 'ac_current_employ_id:' + value;
                    })
                    return crdString + ')';
                }
                else {
                    console.error("iFrame parameter must supply at least one CRD number. Returning for all CRDs.");
                }
                return crdString;
            }
    }

})();(function() {
    angular.module('listwidget.core',['ui.router', 'ngSanitize']);
})();(function() {
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
})();(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope', '$state', '$sanitize', 'urlfactory', 'dataservice','itemshareservice', '$window'];

    function ListController($scope, $state, $sanitize,  urlfactory, dataservice, itemshareservice, $window) {
        var vm = this;
        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.loadMore = loadMore;
        vm.select = select;
        vm.results = [];


        vm.results = itemshareservice.getList();


        vm.goToSite = goToSite;

        function goToSite(url) {
            $window.open(url);
        }
        function select(item) {
            itemshareservice.setItem(item);

            $state.go('detail');
        };
        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }

        function loadMore() {

            if (!angular.isUndefined(vm.results)) {
                var startPosition = vm.results.length;
            }
            else {
                var startPosition = 0;
            }
            $scope.$parent.vm.search(true, startPosition);
        }
    }
})();(function() {
    angular.module('listwidget.list')
        .controller('ListDetailController', ListDetailController);

    ListDetailController.$inject = ['$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window'];

    function ListDetailController($state, tooltips, externalUrls, dataservice, itemshareservice, $window) {
        var vm = this;
        vm.item = itemshareservice.getItem();
        vm.bcIndUrl = externalUrls.bcIndUrl;
        vm.iaIndUrl = externalUrls.iaIndUrl;
        vm.brokerToolTip = tooltips.broker;
        vm.iaToolTip = tooltips.investmentAdvisor;
        vm.disclosureToolTip = tooltips.disclosure;

        vm.goBack = goBack;
        vm.isBroker = isBroker;
        vm.isInvestmentAdvisor = isInvestmentAdvisor;
        vm.isBoth = isBoth;
        vm.isNeither = isNeither;
        vm.hasDisclosures = hasDisclosures;
        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.openFullReport = openFullReport;

        function goBack(state) {
            $state.go(state);
        };

        function isBroker(item) {

            return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl !== "Y");
        };
        function isInvestmentAdvisor(item) {

            return (item.fields.ac_ia_active_fl === "Y" && item.fields.ac_bc_active_fl !== "Y");
        };
        function isBoth(item) {

            return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl === "Y");

        };
        function isNeither(item) {

            return (item.fields.ac_bc_active_fl !== "Y" && item.fields.ac_ia_active_fl !== "Y");
        };
        function hasDisclosures(item) {

            return (item.fields.ac_bc_dsclr_fl === "Y" || item.fields.ac_ia_dsclr_fl === "Y");
        }
        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }
        function openFullReport(item) {
            var url = '';
            if (isBoth(item) || isBroker(item)) {
                url = externalUrls.bcIndUrl + '/' + item.fields.ac_source_id;
            }
            else if (isInvestmentAdvisor(item)) {
                url = externalUrls.iaIndUrl + '/' + item.fields.ac_source_id;
            }
            else {
                url = 'http://brokercheck.finra.org'
            }
            $window.open(url);
        }

    }
})();(function() {
    angular.module('listwidget.list', ['infinite-scroll']);
})();(function() {
    angular.module('listwidget.list')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state','$sanitize', 'dataservice', 'urlfactory', 'itemshareservice'];

    function SearchController($scope, $state, $sanitize, dataservice, urlfactory, itemshareservice) {
        var vm = this;
        vm.query = '';
        vm.noresults = false;
        vm.search = search;
        var items = [];
        vm.results = [];
        vm.getViewState = getViewState;



        var crdnumbers =  $sanitize(urlfactory.getQueryStringVar('crds')).split(',');

        var params = {
            'json.wrf': 'JSON_CALLBACK',
            results: 20,
            sources: 'BC_INDIVIDUALS_2210',
            hl: false,
            wt: 'json'
        };



        $scope.$watch("vm.query", function(newValue, oldValue){

            if (newValue != oldValue) {
                vm.results = [];
                search(false, 0);

            }
        });


        function getViewState() {
                if ($state.current.name == 'list') {
                    return 'slideInLeft';
                }
                else {
                    return 'slideInRight';
                }
         }


        function search(append, startWith) {

            if (angular.isUndefined(vm.query) || vm.query.length === 0) {
                $state.go('info');
            }
            else {

                if (append===true) {
                    params.start = startWith;
                }
                else {
                    params.start = 0;
                }

                params.query = dataservice.concatWords(vm.query);
                params.filter =  '(ac_ia_active_fl:Y+OR+ac_bc_active_fl:Y)' + urlfactory.createQueryStringEle(crdnumbers);


                dataservice.searchBy(params, true)
                    .then(function (data) {
                        vm.noresults = false;

                        items = data.results.BC_INDIVIDUALS_2210.results;
                        var total = data.results.BC_INDIVIDUALS_2210.totalResults;

                        if (total === 0) {
                            vm.noresults = true;
                        }
                        else {

                            if (startWith > 0) {
                                for (i = 0; i < items.length; i++) {
                                    vm.results.push(items[i]);
                                }
                            }
                            else {


                                vm.results = items;
                                itemshareservice.setList(vm.results);
                                $state.go('list');

                            }
                        }

                    }), function (error) {
                    $state.go('error');
                    console.error('error' + error)
                };
            }
        }
    }
})();(function() {
    angular.module('listwidget.messages')
        .controller('MessagesController', MessagesController);

    MessagesController.$inject = ['urlfactory', '$sce'];

    function MessagesController(urlfactory, $sce) {
        var vm = this;
        vm.firmname = decodeURI(urlfactory.getQueryStringVar('firmname'));

    }
})();(function() {
    angular.module('listwidget.messages', ['listwidget.core']);
})()