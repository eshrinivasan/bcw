(function() {
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
        vm.goToSite = goToSite;
        vm.results = itemshareservice.getList();
        vm.animeClass = 'slideInLeft';

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
})()