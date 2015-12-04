(function() {
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
})()