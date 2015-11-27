(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$rootScope','$scope', '$state', '$sanitize', 'urlfactory', 'dataservice','itemshareservice', '$window', '$anchorScroll', '$location'];

    function ListController($rootScope, $scope, $state, $sanitize,  urlfactory, dataservice, itemshareservice, $window, $anchorScroll, $location) {
        var vm = this;
        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.loadMore = loadMore;
        vm.select = select;
        vm.results = [];
        vm.goToSite = goToSite;
        var scrollTo = scrollTo;
        vm.results = itemshareservice.getList();
        vm.animeClass = 'slideInLeft';



        $rootScope.$on('$viewContentLoaded',
            function(event){

            console.log(event);
            })

        function scrollTo(div) {

        }

        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event) {
            itemshareservice.setItem(item);

            vm.selectedId = event.currentTarget.id;
            console.log(vm.selectedId);

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