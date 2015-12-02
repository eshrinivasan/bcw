(function() {
    angular.module('listwidget.list', ['ngAnimate', 'ui.router', 'rt.popup', 'perfect_scrollbar']);
})();(function() {
    angular.module('listwidget.list')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state','$sanitize', 'dataservice', 'urlfactory', 'itemshareservice'];

    function SearchController($scope, $state, $sanitize, dataservice, urlfactory, itemshareservice) {
        var searchCtl = this;
        searchCtl.query = '';
        searchCtl.noresults = false;
        searchCtl.search = search;
        searchCtl.loadMore = loadMore;
        $scope.isList = dataservice.isList();
        $scope.animeClass = 'fadeInRight';
        var items = [];
        var crdnumbers =  $sanitize(urlfactory.getQueryStringVar('crds')).split(',');
        var params = {
            'json.wrf': 'JSON_CALLBACK',
            results: 20,
            sources: 'BC_INDIVIDUALS_2210',
            hl: false,
            wt: 'json'
        };


        $scope.$watch("searchCtl.query", function(newValue, oldValue){

            if (newValue != oldValue) {
                searchCtl.results = [];
                search(false, 0);

            }
        });

        function search(append, startWith) {

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
                        var total = data.results.BC_INDIVIDUALS_2210.totalResults;
                        if (total === 0) {
                            searchCtl.noresults = true;
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
                                   return false;
                                }
                            }
                            else {
                                searchCtl.results = [];
                                searchCtl.results = items;
                                $state.go('list');

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
            search(true, startPosition);
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
        '$rootScope'];

    function ListController($scope,
                            $state,
                            dataservice,
                            itemshareservice,
                            $window,
                            $rootScope) {
        var listCtl = this;

        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.scrollTo = scrollTo;
        listCtl.animeClass = 'fadeInLeft';
        listCtl.element = '';
        $scope.isList = dataservice.isList();


        function scrollTo(element) {
            jQuery( 'html, body').animate({
                scrollTop: jQuery(element).offset()
            }, 2000);
        }

        $rootScope.$on('$stateChangeSuccess', function (event) {
           // console.log($rootScope.offset);
           // $window.pageYOffset =  $rootScope.offset;
            listCtl.scrollTo(listCtl.element);

        });
        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event, index) {
            itemshareservice.setItem(item);
            listCtl.element = event.currentTarget.id;
            $state.go('detail');
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

    ListDetailController.$inject = ['$scope', '$stateParams', '$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window'];

    function ListDetailController($scope, $stateParams, $state, tooltips, externalUrls, dataservice, itemshareservice, $window) {
        var detailCtl = this;
        detailCtl.item = itemshareservice.getItem();
        detailCtl.bcIndUrl = externalUrls.bcIndUrl;
        detailCtl.iaIndUrl = externalUrls.iaIndUrl;
        detailCtl.brokerToolTip = tooltips.broker;
        detailCtl.iaToolTip = tooltips.investmentAdvisor;
        detailCtl.disclosureToolTip = tooltips.disclosure;
        $scope.animeClass = 'fadeInRight';

        detailCtl.goBack = goBack;
        detailCtl.isBroker = isBroker;
        detailCtl.isInvestmentAdvisor = isInvestmentAdvisor;
        detailCtl.isBoth = isBoth;
        detailCtl.isNeither = isNeither;
        detailCtl.hasDisclosures = hasDisclosures;
        detailCtl.getFullName = getFullName;
        detailCtl.getLocations = getLocations;
        detailCtl.openFullReport = openFullReport;
        detailCtl.placement = placement;
        $scope.isList = dataservice.isList();

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
        }

    }
})()