(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$rootScope','$scope', '$state', '$sanitize', 'urlfactory', 'dataservice','itemshareservice', '$window', '$anchorScroll', '$location'];

    function ListController($rootScope, $scope, $state, $sanitize,  urlfactory, dataservice, itemshareservice, $window, $anchorScroll, $location) {
        var vm = this;

        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.select = select;
        vm.goToSite = goToSite;
        var scrollTo = scrollTo;
        vm.animeClass = 'slideInLeft';


        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event) {
            itemshareservice.setItem(item);

            vm.selectedId = event.currentTarget.id;

            $state.go('detail');
        };
        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }


    }
})()