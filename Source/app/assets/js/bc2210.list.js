(function() {
    angular.module('listwidget.list', ['ngAnimate', 'ui.router', 'ngSanitize', 'angulartics', 'angulartics.google.analytics', 'jQueryScrollbar']);
})();(function() {
    angular.module('listwidget.list')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope','$rootScope', '$state','$sanitize', 'dataservice', 'urlfactory', 'itemshareservice','$timeout', '$analytics'];

    function SearchController($scope, $rootScope, $state, $sanitize, dataservice, urlfactory, itemshareservice, $timeout, $analytics) {
        var searchCtl = this;
        searchCtl.query = '';
        searchCtl.hasMore = hasMore;
        searchCtl.isEmpty = isEmpty;
        searchCtl.search = search;
        searchCtl.loadMore = loadMore;
        $scope.isList = dataservice.isList();
        $scope.isDetail = dataservice.getCurrentState() === 'detail';

        $scope.slideLeft = dataservice.slideLeft();
        var items = [];
        var crdnumbers =  $sanitize(urlfactory.getQueryStringVar('crds')).split(',');
        var params = {
            'json.wrf': 'JSON_CALLBACK',
            results: 20,
            sources: 'BC_INDIVIDUALS_2210',
            hl: false,
            wt: 'json'
        };

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

            var toState = to.name;
            var fromState = from.name;

            if (to.state === 'detail' && (fromState === 'disclosure' || fromState === 'ia' || fromState ==='broker')) {
                $scope.slideLeft = true;
            }
            else {
                $scope.slideLeft = false;
            }

        });
        $scope.$watch("searchCtl.query", function(newValue, oldValue){

            if (newValue != oldValue) {
                searchCtl.results = [];
                search(false, 0);

            }
        });


        function search(append, startWith) {

            $state.go('list');
            if (angular.isUndefined(searchCtl.query) || searchCtl.query.length === 0) {
                $state.go('info');
            }
            else {

                if (append===true) {

                    params.start = startWith;
                }
                else {
                    params.start = 0;
                }
                params.query = dataservice.concatWords(searchCtl.query);
                params.filter =  '(ac_ia_active_fl:Y+OR+ac_bc_active_fl:Y)' + urlfactory.createQueryStringEle(crdnumbers);

                dataservice.searchBy(params, true)
                    .then(function (data) {

                        searchCtl.noresults = false;
                        searchCtl.moreresults = true;
                        var total = data.results.BC_INDIVIDUALS_2210.totalResults;
                        var errorCode = data.errorCode;
                        var errorMessage = data.errorMessage;
                        searchCtl.total = total;

                        if (total === 0) {
                           if (errorCode === -1) {
                               console.error('Error: ' + errorMessage);
                               $state.go('error');
                               return false;
                           }
                            else {
                               searchCtl.noresults = true;
                               searchCtl.moreresults = false;
                           }
                        }
                        else {
                            items = data.results.BC_INDIVIDUALS_2210.results;
                            if (startWith > 0) {

                                if (startWith < total) {

                                    for (i = 0; i < items.length; i++) {
                                        searchCtl.results.push(items[i]);
                                    }
                                }
                                else {
                                   searchCtl.moreresults = false;
                                   searchCtl.noresults = true;
                                   return false;
                                }
                            }
                            else {
                                searchCtl.results = [];
                                searchCtl.results = items;
                          }


                        }

                    }), function (error) {
                    $state.go('error');
                    console.error('error' + error)
                };
            }
        }
        function loadMore() {
            if (!angular.isUndefined(searchCtl.results)) {
                var startPosition = searchCtl.results.length;
            }
            else {
                var startPosition = 0;
            }
            $analytics.eventTrack('Click', {
                category: 'BCListItem', label: "LoadMore"
            });
            search(true, startPosition);
        }

        function hasMore() {

            if (searchCtl.total === searchCtl.results.length) {
                return false;
            }
            else {
                return true;
            }
        }
        function isEmpty() {
            if (searchCtl.results.length === 0 && !hasMore()) {
                return true;
            }
            else {
                return false;
            }
        }
    }
})();(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope',
        '$state',
        'dataservice',
        'itemshareservice',
        '$window',
        '$rootScope',
        '$analytics'];

    function ListController($scope,
                            $state,
                            dataservice,
                            itemshareservice,
                            $window,
                            $rootScope,
                            $analytics)  {
        var listCtl = this;

        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.animeClass = 'fadeInLeft';
        listCtl.element = '';
        $scope.isList = dataservice.isList();
        $scope.isDetail = dataservice.getCurrentState() === 'detail';
        $scope.state = $state.current.name;

        $scope.slideLeft = dataservice.slideLeft();

        $scope.jqueryScrollbarOptions = {
            "onScroll": function (y, x) {
                if (y.scroll == y.maxScroll) {

                }
            }
        };


        $rootScope.$on('$stateChangeSuccess', function (event) {
           // console.log($rootScope.offset);
           // $window.pageYOffset =  $rootScope.offset;
            //listCtl.scrollTo(listCtl.element);

        });
        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event, index) {
            itemshareservice.setItem(item);
            listCtl.element = event.currentTarget.id;
            $state.go('detail');
            $analytics.eventTrack('Click', {
                category: 'BCListItem', label:getFullName(item)
            });
        };

        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }


    }
})();(function() {
    angular.module('listwidget.list')
        .controller('ListDetailController', ListDetailController);

    ListDetailController.$inject = ['$scope', '$stateParams', '$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window', '$analytics'];

    function ListDetailController($scope, $stateParams, $state, tooltips, externalUrls, dataservice, itemshareservice, $window, $analytics) {
        var detailCtl = this;
        detailCtl.item = itemshareservice.getItem();
        detailCtl.bcIndUrl = externalUrls.bcIndUrl;
        detailCtl.iaIndUrl = externalUrls.iaIndUrl;
        detailCtl.brokerToolTip = tooltips.broker;
        detailCtl.iaToolTip = tooltips.investmentAdvisor;
        detailCtl.disclosureToolTip = tooltips.disclosure;
        $scope.state = $state.current.name;

        detailCtl.goBack = goBack;
        detailCtl.isBroker = isBroker;
        detailCtl.isInvestmentAdvisor = isInvestmentAdvisor;
        detailCtl.isBoth = isBoth;
        detailCtl.isNeither = isNeither;
        detailCtl.hasDisclosures = hasDisclosures;
        detailCtl.getFullName = getFullName;
        detailCtl.getLocations = getLocations;
        $scope.openFullReport = openFullReport;
        detailCtl.placement = placement;
        $scope.isList = dataservice.isList();
        $scope.isDetail = dataservice.getCurrentState() === 'detail';

        $scope.slideLeft = dataservice.slideLeft();
        function placement(anchor) {
            return anchor.left < $window.width / 2 ? "right" : "left";
        };

          function goBack(state) {
              $state.go(state);
              //$window.history.back;
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
                url = externalUrls.bcIndUrl + item.fields.ac_source_id;
            }
            else if (isInvestmentAdvisor(item)) {
                url = externalUrls.iaIndUrl + item.fields.ac_source_id;
            }
            else {
                url = 'http://brokercheck.finra.org'
            }
            $window.open(url);
            $analytics.eventTrack('Click', {
                category: 'GetDetails', label: url
            });
        }

    }
})()