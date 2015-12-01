(function() {
    angular.module('listwidget.list')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state','$sanitize', 'dataservice', 'urlfactory', 'itemshareservice', 'iScrollService'];

    function SearchController($scope, $state, $sanitize, dataservice, urlfactory, itemshareservice, iScrollService) {
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
            console.log('does this get called?');
            if (!angular.isUndefined(vm.results)) {
                var startPosition = vm.results.length;
            }
            else {
                var startPosition = 0;
            }

            search(true, startPosition);
        }
    }
})()