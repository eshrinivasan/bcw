(function() {
    angular.module('listwidget.list', ['infinite-scroll', 'ngAnimate', 'ui.router']);
})();(function() {
    angular.module('listwidget.list')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state','$sanitize', 'dataservice', 'urlfactory', 'itemshareservice'];

    function SearchController($scope, $state, $sanitize, dataservice, urlfactory, itemshareservice) {
        var vm = this;
        vm.query = '';
        vm.noresults = false;
        vm.search = search;
        vm.animeClass = 'slideInRight';
        vm.loadMore = loadMore;

        var items = [];
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


        function isList() {
            var state = dataservice.getCurrentState();
            return state === 'list';
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
                        var total = data.results.BC_INDIVIDUALS_2210.totalResults;
                        if (total === 0) {
                            vm.noresults = true;
                        }
                        else {
                            items = data.results.BC_INDIVIDUALS_2210.results;
                            if (startWith > 0) {

                                if (startWith < total) {

                                    for (i = 0; i < items.length; i++) {
                                        vm.results.push(items[i]);
                                    }
                                }
                                else {
                                   return false;
                                }
                            }
                            else {
                                vm.results = [];
                                vm.results = items;
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
            if (!angular.isUndefined(vm.results)) {
                var startPosition = vm.results.length;
            }
            else {
                var startPosition = 0;
            }

            search(true, startPosition);
        }
    }
})();(function() {
    angular.module('listwidget.list')
        .controller("ScrollController", ScrollController)
        .directive("preserveScroll", function preserveScroll($window, $timeout){
            return {
                restrict: 'AE',
                controller: 'ScrollController',
                link: function(scope, element, attr, sctrl) {

                    scope.scrollPos = {};

                    $(element).on("scroll", function() {
                       // console.log(this.scrollTop);
                        scope.scrollPos.offset = this.scrollTop;
                        console.log(scope.scrollPos.offset);

                        sctrl.setPosition(scope.scrollPos.offset);
                        scope.$apply();

                    });

                }
            }

        });

    ScrollController.$inject = ['$rootScope', '$window', '$element'];
    function ScrollController($rootScope, $window, $element) {
        var scroll = this;
        scroll.setPosition = setPosition;
        scroll.getPosition = getPosition;
        //scroll.offset = 0;

        console.log($element);
        $element.scrollTop = scroll.getPosition();
        function getPosition() {
            return $rootScope.offset;
        }

        function setPosition(offset) {
            $rootScope.offset = offset;
        }

    }


})();(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$state',
        'dataservice',
        'itemshareservice',
        '$window',
        '$rootScope'];

    function ListController($state,
                            dataservice,
                            itemshareservice,
                            $window,
                            $rootScope) {
        var vm = this;

        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.select = select;
        vm.goToSite = goToSite;
        vm.scrollTo = scrollTo;
        vm.animeClass = 'slideInLeft';
        vm.element = '';

        function scrollTo(element) {
            jQuery( 'html, body').animate({
                scrollTop: jQuery(element).offset()
            }, 2000);
        }

        $rootScope.$on('$stateChangeSuccess', function (event) {
           // console.log($rootScope.offset);
           // $window.pageYOffset =  $rootScope.offset;
            vm.scrollTo(vm.element);

        });
        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event, index) {
            itemshareservice.setItem(item);
            vm.element = event.currentTarget.id;
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
        var vm = this;
        vm.item = itemshareservice.getItem();
        vm.bcIndUrl = externalUrls.bcIndUrl;
        vm.iaIndUrl = externalUrls.iaIndUrl;
        vm.brokerToolTip = tooltips.broker;
        vm.iaToolTip = tooltips.investmentAdvisor;
        vm.disclosureToolTip = tooltips.disclosure;
        vm.animeClass = 'slideInRight';

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