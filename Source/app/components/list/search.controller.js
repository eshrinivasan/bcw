(function() {
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
        $scope.isDetail = dataservice.getCurrentState() === 'detail';

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
})()