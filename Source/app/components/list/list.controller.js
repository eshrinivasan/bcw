(function() {
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
        var listCtl = this;

        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.scrollTo = scrollTo;
        listCtl.animeClass = 'fadeInLeft';
        listCtl.element = '';


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
})()