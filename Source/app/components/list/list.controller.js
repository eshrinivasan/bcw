(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$state',
        'dataservice',
        'itemshareservice',
        'iScrollService',
        '$window',
        '$rootScope'];

    function ListController($state,
                            dataservice,
                            itemshareservice,
                            iScrollService,
                            $window,
                            $rootScope) {
        var vm = this;

        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.select = select;
        vm.goToSite = goToSite;
        vm.scrollTo = scrollTo;
        vm.animeClass = 'fadeInLeft';
        vm.element = '';
        vm.iScrollState = iScrollService.state;



        vm.iScrollState.mouseWheel = true;

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
})()