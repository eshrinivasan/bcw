(function() {
    angular.module('listwidget.list', ['ngAnimate', 'ui.router', 'ngSanitize', 'angulartics', 'angulartics.google.analytics', 'ngScrollbars','pdwidget.stickyscroll']);
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
        $scope.animationClass = 'fadeInLeft';
        $scope.noresults = true;
        searchCtl.hideLoadMore = false;


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

            if ((fromState === 'list' && toState === 'detail') || (toState === 'disclosure' || toState === 'ia' || toState ==='broker')) {
                $scope.animationClass = 'fadeInRight';
            }
            else if ((fromState === 'detail' && toState === 'list') || (fromState === 'detail' &&
                (toState === 'detail' && (fromState === 'disclosure' || fromState === 'ia' || fromState ==='broker')))) {
                $scope.animationClass = 'fadeInLeft';
            }
            else {
                $scope.animationClass = 'fadeInLeft';
            }
        });

        $scope.$watch("searchCtl.query", function(newValue, oldValue){
            if (newValue != oldValue) {
                searchCtl.results = [];
                searchCtl.hideLoadMore = true;
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

                        $scope.noresults = true;
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
                               $scope.noresults = true;
                           }
                        }
                        else {
                            $scope.noresults = false;
                            items = data.results.BC_INDIVIDUALS_2210.results;
                            if (startWith > 0) {

                                if (startWith < total) {

                                    for (i = 0; i < items.length; i++) {
                                        searchCtl.results.push(items[i]);
                                    }
                                    searchCtl.hideLoadMore = false;
                                }
                                else {
                                   searchCtl.noresults = true;
                                   return false;
                                    searchCtl.hideLoadMore = true;
                                }
                            }
                            else {
                                $scope.noresults = false;
                                searchCtl.results = [];
                                searchCtl.results = items;
                                searchCtl.hideLoadMore = false;
                          }


                        }

                    }), function (error) {
                        $state.go('error');
                        console.error('error' + error);

                        $analytics.eventTrack('Keypress', {
                                category: 'BCError', label: 'SearchError'
                        });
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

            if (searchCtl.total === searchCtl.results.length || searchCtl.total === 0) {
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
                            $analytics) {
        var listCtl = this;
        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.element = '';




        $scope.scrollConfig = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced:{
                updateOnContentResize: true
            },

            scrollbarPosition: 'inside',
            scrollInertia: 100,
            alwaysShowScrollbar: 2,
            mousewheel : {
                enable : true,
                scrollAmount : 30
            },
            keyboard : {
                enable : true
            },
            contentTouchScroll : 25,
            documentTouchScroll : true,
            callbacks:{
            onScroll: function(){
                var scrollPosition = 0;
                scrollPosition = this.mcs.top;
                itemshareservice.setScrollPos(scrollPosition);
            }
        }


        };

        $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

            if (toState.name === 'list' && fromState.name === 'detail') {
                var data = itemshareservice.getScrollPos();
             //   var item = shareselecteditem.getItem();
                $scope.scrollPosition = data;
                console.log($scope.scrollPosition);
             //   $scope.selected = item.value;

            }

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

        detailCtl.goBack = goBack;
        detailCtl.isBroker = isBroker;
        detailCtl.isInvestmentAdvisor = isInvestmentAdvisor;
        detailCtl.isBoth = isBoth;
        detailCtl.isNeither = isNeither;
        detailCtl.hasDisclosures = hasDisclosures;
        detailCtl.getFullName = getFullName;
        detailCtl.getLocations = getLocations;
        $scope.openFullReport = openFullReport;


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
                category: 'BCGetDetails', label: url
            });
        }

    }
})()